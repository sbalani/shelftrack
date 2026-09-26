"use client";

import { Camera, Check, Crosshair, ImagePlus, LoaderCircle, MapPin, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function CaptureForm({ currentUser, allowDelegation }: { currentUser: string; allowDelegation: boolean }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => () => photos.forEach((url) => URL.revokeObjectURL(url)), [photos]);

  function addPhotos(files: FileList | null) {
    if (!files) return;
    setPhotos((current) => [...current, ...Array.from(files).map((file) => URL.createObjectURL(file))]);
  }

  function locate() {
    setLocating(true);
    if (!navigator.geolocation) {
      setLocation("Location unavailable");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
        setLocating(false);
      },
      () => {
        setLocation("Enter the store address manually");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  if (submitted) {
    return (
      <section className="capture-success">
        <span><Check size={34} /></span>
        <p className="eyebrow">Capture queued</p>
        <h2>Shelf visit ready for review</h2>
        <p>The interface flow is complete. Database persistence and image upload will be connected in the next backend phase.</p>
        <button className="button button-primary" onClick={() => { setSubmitted(false); setPhotos([]); }}>Start another capture</button>
      </section>
    );
  }

  return (
    <form className="capture-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <section className="form-section photo-section">
        <div className="section-number">01</div>
        <div className="section-content">
          <div className="section-title"><div><p className="eyebrow">Evidence</p><h2>Add shelf photos</h2></div><span>{photos.length} added</span></div>
          <label className="photo-drop">
            <input type="file" accept="image/*" capture="environment" multiple required={photos.length === 0} onChange={(e) => addPhotos(e.target.files)} />
            <span className="drop-icon"><Camera size={28} /></span>
            <strong>Take photos or choose from library</strong>
            <small>Capture the full bay straight-on. JPG, PNG or HEIC.</small>
            <span className="button button-secondary"><ImagePlus size={17} />Add photos</span>
          </label>
          {photos.length ? <div className="photo-preview-grid">{photos.map((src, index) => <div key={src}><Image src={src} alt={`Shelf preview ${index + 1}`} width={180} height={180} unoptimized /><button type="button" aria-label="Remove photo" onClick={() => setPhotos((items) => items.filter((_, itemIndex) => itemIndex !== index))}><X size={15} /></button></div>)}</div> : null}
        </div>
      </section>

      <section className="form-section">
        <div className="section-number">02</div>
        <div className="section-content">
          <div className="section-title"><div><p className="eyebrow">Visit details</p><h2>Where and when?</h2></div></div>
          <div className="form-grid">
            <div className="field field-span"><label htmlFor="store">Store name</label><input id="store" name="store" placeholder="e.g. Grand Lucky SCBD" required /></div>
            <div className="field field-span"><label htmlFor="location">Location</label><div className="input-action"><MapPin size={17} /><input id="location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Address or GPS coordinates" required /><button type="button" onClick={locate}>{locating ? <LoaderCircle className="spin" size={17} /> : <Crosshair size={17} />}<span>Use GPS</span></button></div></div>
            <div className="field"><label htmlFor="date">Capture date</label><input id="date" name="date" type="date" defaultValue={today} required /></div>
            <div className="field"><label htmlFor="time">Capture time</label><input id="time" name="time" type="time" defaultValue={new Date().toTimeString().slice(0, 5)} required /></div>
          </div>
        </div>
      </section>

      <section className="form-section">
        <div className="section-number">03</div>
        <div className="section-content">
          <div className="section-title"><div><p className="eyebrow">Attribution</p><h2>Who collected this?</h2></div>{allowDelegation ? <span className="permission-note">Can submit on behalf</span> : null}</div>
          {allowDelegation ? (
            <div className="form-grid"><div className="field"><label htmlFor="collector">Collected by</label><input id="collector" name="collector" defaultValue={currentUser} placeholder="Search team member" required /></div><div className="field"><label htmlFor="collector-email">Collector email or ID</label><input id="collector-email" name="collectorEmail" placeholder="Optional reference" /></div></div>
          ) : (
            <div className="collector-lock"><span className="avatar">{currentUser.slice(0, 2).toUpperCase()}</span><div><strong>{currentUser}</strong><span>This capture will be assigned to you</span></div><Check size={19} /></div>
          )}
          <div className="field notes-field"><label htmlFor="notes">Visit notes <span>Optional</span></label><textarea id="notes" name="notes" placeholder="Add context about stock, display quality, promotions, or access issues." rows={4} /></div>
        </div>
      </section>

      <footer className="capture-actions"><div><UploadCloud size={20} /><span>Photos stay private and are uploaded securely.</span></div><button className="button button-primary" type="submit">Submit shelf capture <Check size={18} /></button></footer>
    </form>
  );
}

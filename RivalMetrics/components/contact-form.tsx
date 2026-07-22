"use client";

import { useState } from "react";
import { Button } from "./ui";
import styles from "./contact-form.module.css";

type Status = "idle" | "submitting" | "success" | "error";

/** Contact form. Submits to /api/contact and shows accessible status. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Request failed");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.result} role="status">
        <div className={styles.resultIcon} aria-hidden="true">✓</div>
        <h3>Thanks — message received</h3>
        <p className="muted">
          We read every message. If you asked for a reply, we'll get back to you
          at the email you provided.
        </p>
        <Button variant="secondary" onClick={() => setStatus("idle")}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            className={styles.input}
            maxLength={120}
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className={styles.input}
            required
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Subject</span>
        <select name="subject" className={styles.input} defaultValue="General">
          <option>General</option>
          <option>Security report</option>
          <option>Data / methodology question</option>
          <option>Donation question</option>
          <option>Press</option>
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Message</span>
        <textarea
          name="message"
          rows={6}
          className={styles.input}
          maxLength={4000}
          required
        />
      </label>

      {/* Honeypot: hidden from real users, bots will fill it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className={styles.honeypot}
        aria-hidden="true"
      />

      {status === "error" && (
        <p className={styles.error} role="alert">
          {error || "Could not send. Please try again."}
        </p>
      )}

      <div className={styles.actions}>
        <Button type="submit" variant="primary">
          {status === "submitting" ? "Sending…" : "Send message"}
        </Button>
        <span className={styles.note}>
          We never share your message with third parties.
        </span>
      </div>
    </form>
  );
}

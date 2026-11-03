'use client';

import { useEffect } from 'react';

export default function DograhWidget() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('dograh-widget')) return;

    const script = document.createElement('script');
    script.id = 'dograh-widget';
    script.src =
      'https://app.dograh.com/embed/dograh-widget.js?token=emb_hFS4ICIwiyVSp91chj3eamuaYoYw69aXGkb859OSVZE&environment=production&apiEndpoint=https://api.dograh.com';
    script.setAttribute(
      'data-dograh-context',
      JSON.stringify({
        page_url: window.location.href,
        today: new Date().toISOString().slice(0, 10),
      })
    );
    script.async = true;

    document.body.appendChild(script);
  }, []);

  return null;
}

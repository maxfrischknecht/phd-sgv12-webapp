// // src/routes/+page.server.js
export async function load({fetch}) {
    const res = await fetch('/data/sgv-12-comments_series_timeline.json');
    const data = await res.json();
  
    return {
      data
    };
  }
  
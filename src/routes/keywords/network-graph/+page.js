// // src/routes/+page.server.js
export async function load({fetch}) {
    const res = await fetch('/data/sgv-12-keywords_graph_data_threshold10.json');
    const data = await res.json();
  
    return {
      data
    };
  }
  
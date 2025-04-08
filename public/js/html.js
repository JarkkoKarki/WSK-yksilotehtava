export function menuHtml(courses) {
  let html = '';
  for (const {name, price, diets} of courses) {
    html += `
  <article class="course">
      <p><strong>${name}</strong>,
      Hinta: ${price} â‚¬,
      Allergeenit: ${diets}</p>
  </article>
  `;
  }
  return html;
}

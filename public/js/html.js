export function menuHtml(courses) {
  try {
    console.log('Courses received in menuHtml:', courses);
    let html = '';
    for (const course of courses) {
      if (course.name) {
        console.log('html ', course);
        const {name, price, diets} = course;
        console.log('ruuat: ', {name, price, diets});
        html += `
          <article class="course">
              <p><strong>${name}</strong>,
              Hinta: ${price || 'Ei hintatietoa'},
              Allergeenit: ${diets || 'Ei tietoa'}</p>
          </article>
        `;
      }
    }
    return html;
  } catch (error) {
    console.error('Error in menuHtml:', error.message);
    return '<p>Ei ruokalistaa saatavilla.</p>';
  }
}
export function chooseDayModal() {
  let html = '';
  html += `
  <div style="display: flex; justify-content: center; align-content: center;" class="modal">
    <div style="display: flex; justify-content: center; align-content: center; flex-direction: column; width:40%;" class="modal-content">
      <span class="close"><button id="closeModal">Sulje</button></span>
      <h2>Valitse päivä</h2>
      <p>Valitse päivä, jolle haluat nähdä ruokalistan:</p>
      <button style="margin: 2rem;" class="day" id="submitDateWeek" value="7">Viikko</button>
      <button class="day" id="submitDateMonday" value="0">Maanantai</button>
      <button class="day" id="submitDateTuesday" value="1">Tiistai</button>
      <button class="day" id="submitDateWednesday" value="2">Keskiviikko</button>
      <button class="day" id="submitDateThursday" value="3">Torstai</button>
      <button class="day" id="submitDateFriday" value="4">Perjantai</button>
      <button class="day" id="submitDateSaturday" value="5">Lauantai</button>
      <button class="day" id="submitDateSunday" value="6">Sunnuntai</button>
    </div>
  </div>
  `;
  return html;
}

export const menuWeekHtml = (courses) => {
  if (!courses || courses.length === 0) {
    createErrorHtml();
    return '<p>Ei viikkoruokalistaa saatavilla.</p>';
  }

  let html = '';
  let num = 0;

  for (const course of courses) {
    if (!course || !course.courses) {
      console.warn(`Invalid course data at index ${num}:`, course);
      continue;
    }

    for (const {name, price, diets} of course.courses) {
      html += `
      <article class="course">
          <p><strong>${name}</strong>,
          Hinta: ${price},
          Allergeenit: ${diets}</p>
      </article>
      `;
    }
    num++;
  }

  return html;
};

export const createErrorHtml = () => {
  let html = '';
  html += `
    <div style="display: flex; justify-content: center; align-content: center;" class="modal">
      <div style="display: flex; justify-content: center; align-content: center; flex-direction: column; width:40%;" class="modal-content">
        <p>Ei ruokalistaa saatavilla.</p>
      </div>
    </div>
  `;
  return html;
};

export const addressHtml = (address) => {
  let html = '';
  html += `
  <div>
    <h3>Osoitteesi: </h3>
    <h4 id="address-h4">${address}</h4>
  </div>

  `;
  return html;
};

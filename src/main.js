import { getStatusIcon, formatDate } from './utils';
import { getTableItems, getCompany, getPhone, getTask } from './leadsApi';

async function renderTable() {
  const tBody = document.querySelector('#tbody');
  if (!tBody) return;

  tBody.innerHTML = '';
  let leads = [];

  const tableItems = await getTableItems();
  if (!tableItems.data?._embedded?.leads) {
    return;
  }

  leads = tableItems.data._embedded.leads;

  leads.forEach((lead) => {
    const { id, price, name } = lead;
    const tr = document.createElement('tr');
    tr.id = `lead-${id}`;
    tr.innerHTML = `
      <td>${id || ''}</td>
      <td>${name || ''}</td>
      <td>${price || ''}</td>
      <td class="company-cell">${createLoader()}</td>
      <td class="phone-cell">${createLoader()}</td>
    `;

    tr.addEventListener('click', () => toggleDetails(tr, lead));
    tBody.appendChild(tr);
  });

  for (const lead of leads) {
    await updateRowDetails(lead);
  }
}

function toggleDetails(row, lead) {
  const detailsRow = document.querySelector(`#details-${lead.id}`);

  if (detailsRow) {
    detailsRow.remove();
  } else {
    renderDetails(row, lead);
  }
}

async function renderDetails(row, lead) {
  const detailsRow = document.createElement('tr');
  detailsRow.id = `details-${lead.id}`;
  detailsRow.classList.add('details-row');
  detailsRow.innerHTML = `
    <td colspan="5">${createLoader()}</td>
  `;
  row.after(detailsRow);

  const task = await getTask(lead.id);

  const detailsData = task.data._embedded.tasks[0];

  const statusIcon = getStatusIcon(detailsData.complete_till);
  const taskDate = formatDate(detailsData.complete_till);
  const content = `
    <div class="details-content">
      <div><strong>ID:</strong> ${detailsData.id}</div>
      <div><strong>Название:</strong> ${lead.name}</div>
      <div><strong>Дата:</strong> ${taskDate}</div>
      <div><strong>Статус:</strong> ${statusIcon}</div>
    </div>
  `;

  detailsRow.querySelector('td').innerHTML = content;
}

async function updateRowDetails(lead) {
  const { id } = lead;

  let companyName = '';

  if (lead._embedded.companies?.length) {
    const company = await getCompany(lead._embedded.companies[0].id);
    companyName = company.data?.name || '';
  }
  updateCell(id, '.company-cell', companyName);

  let phone = '';

  if (lead._embedded.contacts?.length) {
    const contact = await getPhone(lead._embedded.contacts[0].id);
    const phones = contact.data?.custom_fields_values?.find(
      (f) => f.field_code === 'PHONE',
    )?.values;
    phone = phones?.length ? phones[0].value : '';
  }
  updateCell(id, '.phone-cell', phone);
}

function updateCell(rowId, selector, value) {
  const row = document.querySelector(`#lead-${rowId}`);
  if (row) {
    const cell = row.querySelector(selector);
    if (cell) {
      cell.innerHTML = value;
    }
  }
}

function createLoader() {
  const loader = document.createElement('div');
  loader.classList.add('loader');
  return loader.outerHTML;
}

renderTable();

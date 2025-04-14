import { getApi } from './requestQueue';

export async function getTableItems() {
  return getApi({ url: 'leads?with=contacts,companies' });
}

export async function getCompany(id) {
  return getApi({ url: `companies/${id}` });
}

export async function getPhone(id) {
  return getApi({ url: `contacts/${id}` });
}

export async function getTask(id) {
  return getApi({
    url: `tasks?filter[entity_id]=${id}`,
  });
}

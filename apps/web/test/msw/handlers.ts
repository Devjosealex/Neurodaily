import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/users/me', () => {
    return HttpResponse.json({
      id: 'mocked-user-id',
      email: 'test@example.com',
      role: 'user',
      preferences: {},
    });
  }),
  // Ejemplo de handler para API base
  // http.get('*/api/v1/users/me', () => {
  //   return HttpResponse.json({ id: '1', role: 'user', preferences: {} })
  // }),
];

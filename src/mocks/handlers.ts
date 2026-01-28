import { authHandlers } from './handlers/authHandlers';
import { ticketHandlers } from './handlers/ticketHandlers'; // 방금 만든 파일

export const handlers = [...authHandlers, ...ticketHandlers];

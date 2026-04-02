import { app } from '@wix/astro/builders';
import bookingsServicePage from './extensions/dashboard/pages/bookings-service/bookings-service.extension.ts';

export default app().use(bookingsServicePage);

import type { FC } from 'react';
import { useCallback, useState } from 'react';
import {
  Button,
  EmptyState,
  Loader,
  Page,
  Text,
  WixDesignSystemProvider,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { categories, services } from '@wix/bookings';
import { auth } from '@wix/essentials';

const elevatedCreateService = auth.elevate(services.createService);

function formatError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'object' && err !== null && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  return String(err);
}

const BookingsServicePage: FC = () => {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateClass = useCallback(async () => {
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const listed = await categories.listCategories();
      const first = listed.categories?.[0];
      if (!first?._id) {
        throw new Error(
          'No Bookings category found. Create at least one category in Wix Bookings on this site first.'
        );
      }

      const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const created = await elevatedCreateService({
        type: 'CLASS',
        name: `CLI demo class (${stamp})`,
        description: 'Sample class created by the Bookings Service Creator app.',
        tagLine: 'Demo class',
        defaultCapacity: 10,
        category: { _id: first._id },
        payment: {
          rateType: 'FIXED',
          fixed: {
            price: { value: '25', currency: 'USD' },
          },
          options: {
            online: true,
            inPerson: true,
            deposit: false,
            pricingPlan: false,
          },
        },
        onlineBooking: {
          enabled: true,
          requireManualApproval: false,
          allowMultipleRequests: false,
        },
      });

      setMessage(`Created: ${created.name} (id: ${created._id ?? 'n/a'})`);
    } catch (e) {
      setError(formatError(e));
    } finally {
      setBusy(false);
    }
  }, []);

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Page>
        <Page.Header
          title="Bookings Service Creator"
          subtitle="Creates a sample Wix Bookings class on the installed site."
        />
        <Page.Content>
          {busy ? (
            <Loader text="Creating Bookings service..." />
          ) : (
            <EmptyState
              title="Create a sample class"
              subtitle="Requires Manage Bookings permission for this app, Wix Bookings on the site, and at least one service category. Uses elevated API access."
              skin="page"
            >
              <Button onClick={handleCreateClass}>Create sample class service</Button>
            </EmptyState>
          )}
          {message ? (
            <Text size="small" style={{ marginTop: '16px' }}>
              {message}
            </Text>
          ) : null}
          {error ? (
            <Text size="small" skin="error" style={{ marginTop: '16px' }}>
              {error}
            </Text>
          ) : null}
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
};

export default BookingsServicePage;

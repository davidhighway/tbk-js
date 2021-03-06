// @flow

import {
  Connection,
  NativeControllerLoader,
  Transaction,
  launchThenAcknowledgeTx,
} from '../src';
import {mockRpcEnabled} from './__mocks__/node-fetch';
import {url} from './url';
import {newAccountWithDif} from './new-bvm-acct-with-dif';

if (!mockRpcEnabled) {
  // The default of 5 seconds is too slow for live testing sometimes
  jest.setTimeout(15000);
}

test('load native controller', async () => {
  if (mockRpcEnabled) {
    console.log('non-live test skipped');
    return;
  }

  const connection = new Connection(url);
  const from = await newAccountWithDif(connection, 1024);
  const controllerId = await NativeControllerLoader.load(
    connection,
    from,
    'bitconch_noop_program',
  );
  const transaction = new Transaction().addOperations({
    keys: [{pubkey: from.pubKey, isSigner: true, isDebitable: true}],
    controllerId,
  });

  await launchThenAcknowledgeTx(connection, transaction, from);
});

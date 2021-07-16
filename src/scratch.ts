import {
  createDevnetConnection,
  listMarket,
  DexProgramId,
} from '../test/utils';
import { Account, Connection, PublicKey } from '@solana/web3.js';
import fs from 'fs';
import os from 'os';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const IDS = [
  {
    symbol: 'USDC',
    mint: '8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN',
    dexPk: null,
  },
  {
    symbol: 'MNGO',
    mint: 'Bb9bsTQa1bGEtQ5KagGkvSHyuLqDWumFUcRqFusFNJWC',
    dexPk: 'Aph31hoXRjhk1QgCmRvs7WAWGdpRoaESMoqzjoFkL5mE',
  },
  {
    symbol: 'SOL',
    mint: 'So11111111111111111111111111111111111111112',
    dexPk: 'uaajXobeb1hmTB6StRoa8Yqn6czjtWtFeVfZeJY6YFC',
  },
  {
    symbol: 'SRM',
    mint: 'AvtB6w9xboLwA145E221vhof5TddhqsChYcx7Fy3xVMH',
    dexPk: '23tRuJ3zUvXYQEnTDAcWHPDfmYvrWanpM2sJnmhL53X5', // TODO - create
  },
  {
    symbol: 'BTC',
    mint: '9EkC2nQZ4UTwUCP4dzAi3VxfeMYD87ZpqfZfhygGeR1P',
    dexPk: '6TwwNrueBAHe6VHwDYMhfTtkb7oP2vUnkun5yK8VzBbE', // TODO - create
  },
  {
    symbol: 'ETH',
    mint: 'Cu84KB3tDL6SbFgToHMLYVDJJXdJjenNzSKikeAvzmkA',
    dexPk: '2n81EqJgsTE5PoPX5H8adQ4EaVe5kXnFuxwdCAYfaExH', // TODO - create
  },
  {
    symbol: 'RAY',
    mint: '3YFQ7UYJ7sNGpXTKBxM3bYLVxKpzVudXAe4gLExh5b3n',
    dexPk: '3e7V65UdApsyCMLuALCoQwD9pKDCkozSUrsJx4XMJAnD',
  },
  {
    symbol: 'UNI',
    mint: '7vd84gXdjxRWjtwwkcxpzv1R8W9oCsADemNvRj3Cv5u2',
    dexPk: '4e9bt9ySh9i6Fks2R3KsWTBgJcEDNX6zM4RXHCcWDF3N',
  },
  {
    symbol: 'AAVE',
    mint: '3h7gNYC8aDJ5tGgDt6YKmvLJYT5LNcFb9yiVU1qirDWg',
    dexPk: 'BMigUjf6kDNtNDMCsBvPCwegbL45oLT7rtu1y36vAD1L',
  },
  {
    symbol: 'SUSHI',
    mint: 'Edi5KNs2LnonULNmoTQqSymJ7VuMC9amTjLN5RJ1YMcq',
    dexPk: 'J9aow2hcq6YMJGw7fAprGitP68crYa36r7yJYe5huFv4',
  },
  {
    symbol: 'STEP',
    mint: '62haNTBB4C3gESJyzAvQVAadNxN9zzVt39x5ep5wmaak',
    dexPk: '8P4kZg2c8pAUC6yLv289fR83LJ2wze1ZT247Fw6MhEiC',
  },
  {
    symbol: 'COPE',
    mint: 'BxZBNjYtMgzSF57aiCwrBdLuEL5tSNcGrxQXj7Z7mZQW',
    dexPk: 'Dzc5eZEGHoYEmrYDGWspWcHQw6FG67N6t8NiLhgsLRbi',
  },
  {
    symbol: 'DOGE',
    mint: '6yr1xJP6Nfu8Bxp4L8WJQrtLqBGZrQm5n41PFm4ZmEyk',
    dexPk: 'CrMr521AhZE1FQ9dtBQZczd6SKMpthJMTeQ8WGGRooQ3',
  },
  {
    symbol: 'FIDA',
    mint: 'DRuM89e9xndaRJvjc41zcVWzEAjaytDWUHASydfEEHic',
    dexPk: 'D3P93bKtRzzrJXtBwLcNrswJ3cei1qcrXM9jK6emWZJx',
  },
  {
    symbol: 'FTT',
    mint: 'Fxh4bpZnRCnpg2vcH11ttmSTDSEeC5qWbPRZNZWnRnqY',
    dexPk: 'CiN2BzCaThxLRDALeMq3GJGR24MQhdBWmHHjitW74oST',
  },
  {
    symbol: 'MEDIA',
    mint: 'CU4LrEQChVcis3fsMRciKTgNZSV5A3bh3ftF3Gqnbe78',
    dexPk: 't6Q9ADDNsaQspD4u111fkq8qBzgy1MWoyzX8mDKVbws',
  },
  {
    symbol: 'MER',
    mint: '3QAVaXixBUtHwjponbZZgNVSRqB8YiTqY59pGSWDVS7X',
    dexPk: 'D9Rc98dPsmkfi9wv9yQLKXXu86MZut5jWZSYVCRu51ay',
  },
  {
    symbol: 'AAX',
    mint: 'HDY1CtDh4S5txV84yWfqrM6MuJ1rjCGa6RgV2aNkoq7T',
    dexPk: '9wursY6Ekmephdczc6dmCmhQ9e7Lh7Xbz16fTP4h6KJt',
  },
  {
    symbol: 'BBX',
    mint: '8S894Tytj7RY6gKcvHWvaR8cmrrbwwRQ3w5ufWKvGgBE',
    dexPk: 'FWEHRHn4TLZTvqZSsN8gmpAHzVuDsNcADVieH7gsqy8D',
  },
  {
    symbol: 'CCX',
    mint: 'C2a5sZB6ybhNVWmf3uwLhyszfD2NcndLcAaYTriASvWH',
    dexPk: 'HXxay4VBTXkgkpyresugRdfnnG7j6SzvbmiZvFHjcDhe',
  },
  {
    symbol: 'DDX',
    mint: 'HqWwWZ6dxWWcMXdeYXAxnWYKB37fqEj2wxLwmuQsHwmP',
    dexPk: 'HfPxSpeBJ7tyFVDh2YNMcadX1LUGqcynXiz2cDMqzHCr',
  },
  {
    symbol: 'EEX',
    mint: 'jYmra5J9RCyEnb1D1ScSSLoXLW8j8GZxSFv8kToUUHB',
    dexPk: '6JXADoVE1nWjd2UkpJqU4PLZAj1urqvuZqnrw9dLKonq',
  },
  {
    symbol: 'FFX',
    mint: 'EsUAWWkLG2sE1RkBo74Ta4a7sjaj5JvM1y4Aj1tYXpx6',
    dexPk: 'AU4zXmTdwUgzLW5yWB8qtuPaVqnvLoUXKot6KVdbidPa',
  },
  {
    symbol: 'GGX',
    mint: '6r1A4FQE58pxQubFTN3K8H5J8deNCwBwKReJFjWgV4fg',
    dexPk: 'ETh2Qqrtp53F3BhbXteemWLsjkRiabEnwjoh8TyPLF72',
  },
  {
    symbol: 'HHX',
    mint: 'HNNjUMfUaLmh7yaTqxtz8rdaL2X789jLEqnVUDtqyEgx',
    dexPk: 'BxQAZsUievWE6JyNVJcFsTLqLqahQF7LhM75qXf26Nr7',
  },
  {
    symbol: 'IIX',
    mint: 'BB4jPsmsZURcNkj7qANJcxADHH18aPEKK4J4kiubEWmx',
    dexPk: 'EDJqNqTcojU65uLCMZHb1HjxPuWAAhMahsfGju2SBqsn',
  },
  {
    symbol: 'JJX',
    mint: 'QCKeuUFC3kRhfpLR7HpyCUr5VEjJguuRhngioeaux8L',
    dexPk: 'ugv31rcerPotv8iMXrWDyEjf5TokZWegzDoSK1xL8s9',
  },
  {
    symbol: 'KKX',
    mint: '5txPKV2L86yfqtR9WqmXLtaE2ZdoUuzpUNBmvsAExbu8',
    dexPk: 'C8GiLqrKW3KNfB6y72jSF7WPYCHWkpgbkX48vsPpzxsU',
  },
  {
    symbol: 'LLX',
    mint: 'FqEQxh7VLjPAYd5Y8ea2uwC6ut2tJ4fsim5Mwwb1DPh2',
    dexPk: '4KoZwJizkVaZhAY2Ud9tt3yqUxZrJnEgPTe8dDtM399G',
  },
  {
    symbol: 'MMX',
    mint: 'ENWHT6aaCguz7FDw8v9FBfFAqS4saS4cR2gWje1vHrT9',
    dexPk: '937mGkTYcqGcHoD2UReiC2FJD4DU42rkJciQZ7tQz5H4',
  },
  {
    symbol: 'NNX',
    mint: 'GunmC8Wr9s4AN6errMFQZicdpNUMVUEvAKyTYektXxGe',
    dexPk: '4my2SByxetXARLxpkDG5iV88AVqqsJzUy88CzyjvKvp8',
  },
  {
    symbol: 'OOX',
    mint: '6PTt8kHBncHTELnhJoKXAoU6e6fyETBNi7ojvggtJDK2',
    dexPk: 'GhPwZExZ7uT72n5SdWNMxwddxQ8eG7tuEvX2iSUK4MEY',
  },
];

const connection = createDevnetConnection();
const payer = new Account(
  JSON.parse(
    process.env.KEYPAIR ||
      fs.readFileSync(os.homedir() + '/.config/solana/devnet.json', 'utf-8'),
  ),
);

// TODO - move this into CLI and make it proper
async function mintDevnetTokens() {
  console.log(payer.publicKey.toBase58());
  for (let i = 0; i < IDS.length; i++) {
    const token = new Token(
      connection,
      new PublicKey(IDS[i].mint),
      TOKEN_PROGRAM_ID,
      payer,
    );

    const tokenAccount = await token.getOrCreateAssociatedAccountInfo(
      payer.publicKey,
    );
    console.log(tokenAccount.address.toBase58());
    await token.mintTo(tokenAccount.address, payer, [], 1000000000000);
    console.log('minted', IDS[i].symbol);
  }
}

// mintDevnetTokens();

async function createDexMkts() {
  const quoteToken = IDS.find((id) => id.symbol === 'USDC')?.mint as string;
  const newMkts = IDS.filter((id) => !id.dexPk)
    .filter((id) => id.symbol !== 'USDC')
    .map((id) => id.mint);

  const spotMarketPks: PublicKey[] = [];
  for (const mint of newMkts) {
    spotMarketPks.push(
      await listMarket(
        connection,
        payer,
        new PublicKey(mint),
        new PublicKey(quoteToken),
        10, // TODO: Make this dynamic
        100, // TODO: Make this dynamic
        DexProgramId,
      ),
    );
  }

  console.log(
    'spotMarketPks',
    spotMarketPks.map((mkt) => mkt.toString()),
  );
}

// createDexMkts();

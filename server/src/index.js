import express from 'express';
import { Polybase } from '@polybase/client';
import { ethPersonalSign } from '@polybase/eth';
import bodyParser from 'body-parser';
import EthCrypto from 'eth-crypto';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
// const publicKey = process.env.PUBLIC_KEY;

const db = new Polybase({
    defaultNamespace: "pk/0x3f2d19f61dfe0a5bb4eb4f0fe4342bd1a3530797afa6c1a69c9a2e7e3eb7b196b9ac814e817f97bf25967992db8a468273a744e699dcf72d40e3bd7ab29c48c1/onlyfan3",
    signer: (data) => {
        return {
            h: 'eth-personal-sign',
            sig: ethPersonalSign(privateKey, data),
        };
    },
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('listen on 3000')
});

const authChecker = (req, res, next) => {
    next();
};

const getBalance = async (wallet) => {
   const { data } = await db.collection('Wallet').record(wallet).get();
   return data?.credit || 0;
};

const addBalance = async (wallet, credit) => {
    const { data } = await db.collection('Wallet').record(wallet).get();
    if (data) {
        await db.collection('Wallet').record(wallet).call('update', [credit]);
    } else {
        await db.collection('Wallet').create([wallet, credit]);
    }
    return getBalance(wallet);
};

app.get('/content/:cid', async (req, res) => {
    const { subscriber, creator } = req.query;
    const subscriptionId = `${subscriber}_${creator}`;
    const { data } = await db.collection('Subscription').record(subscriptionId).get();
    if (data.until < new Date().getTime()) {
        res.send('ERROR');
        return;
    }
});

app.get('/wallet', async (req, res) => {
    const wallet = req.query.publicKey;
    const credit = await getBalance(wallet);
    res.json(credit);
});

app.post('/wallet', async (req, res) => {
    try {
        const wallet = req.body.publicKey;
        const credit = await addBalance(wallet, 100);
        res.json(credit);
    } catch(err) {
        // console.log(err);
        res.json(err);
    }
});

app.get('/subscription', async (req, res) => {
    try {
        const { subscriber, creator } = req.query;
        const { data } = creator ? 
            await db.collection('Subscription')
                .where("subscriberId", '==', subscriber)
                .where("creatorId", '==', creator)
                .where("until", ">=", new Date().getTime()).get()
            : await db.collection('Subscription')
                .where("subscriberId", '==', subscriber)
                .get();

        res.json(data.map(d => {
            return {
                until: d.data.until,
                creatorId: d.data.creatorId,
            };
        }).filter(d => d.until > new Date().getTime()));
    } catch {
        res.json([]);
    }
});

app.post('/subscription', async (req, res) => {
    try {
        const { subscriber, creator, month } = req.body;
        if (month <= 0) {
            throw new Error('MONTH_SHOULD_BE_OVER_0');
        }
        const currentBalance = await getBalance(subscriber);
        if(currentBalance < month * 20) {
            throw new Error('NOT_ENOUGH_MONEY');
        } 
        await addBalance(subscriber, -20 * month);
        await addBalance(creator, 20 * month);
        const untilDate = new Date();
        untilDate.setMonth(untilDate.getMonth() + month);
        const subscriptionId = `${subscriber}_${creator}`;
        const { data } = await db.collection('Subscription').record(subscriptionId).get();
        if (data) {
            await db.collection('Subscription').record(subscriptionId).call('update', [untilDate.getTime()]);
        } else {
            await db.collection('Subscription').create([subscriber, creator, untilDate.getTime()]);
        }

        res.json(untilDate.getTime());
    } catch(err) {
        res.json(0);
    }
});

app.get('/', (req, res) => {
    res.send('Hello');
});

// const authMiddleware = (req, res, next) => {
//     const data = req.body;

// };
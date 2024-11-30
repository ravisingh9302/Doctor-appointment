import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import CookieParser from 'cookie-parser';
import httpStatus from 'http-status';
import ApiError from './errors/apiError';
import router from './app/routes';
import config from './config';
import Razorpay = require("razorpay")
const app: Application = express();

app.use(cors());
app.use(CookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/favicon.ico', (req: Request, res: Response) => {
    res.status(204).end();
})

app.post('/createpayment', async (req: Request, res: Response) => {

    const razorpay = new Razorpay({
        key_id: config.Razorpay.api_key,
        key_secret: config.Razorpay.secret_key
    })

    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        payment_capture: 1
    }

    try {
        const response = await razorpay.orders.create(options)

        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount
        })
    } catch (error) {
        res.status(500).send("Internal server error")
    }
})

app.get("/payment/:paymentId", async (req, res) => {
    const { paymentId } = req.params;

    const razorpay = new Razorpay({
        key_id: config.Razorpay.api_key,
        key_secret: config.Razorpay.secret_key
    })

    try {
        const payment = await razorpay.payments.fetch(paymentId)

        if (!payment) {
            return res.status(500).json("Error at razorpay loading")
        }
        console.log("verify payment", payment)
        res.json({
            status: payment?.status,
            method: payment?.method,
            amount: payment?.amount,
            currency: payment?.currency,
            orderid: payment?.order_id,
            payment: payment?.id
        })
    } catch (error) {
        res.status(500).json("failed to fetch")
    }
})

app.get('/', (req: Request, res: Response) => {
    res.send("H i server runingn at 5050")
})

app.use('/api/v1', router);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ success: false, message: err.message })
    } else {
        res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: 'Something Went Wrong',
        });
    }
    next();
})

export default app;
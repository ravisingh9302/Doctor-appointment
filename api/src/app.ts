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

app.post('/orders' ,async(req: Request, res: Response) => {
    const razorpay = new Razorpay({
        key_id : "rzp_test_zi4jtbenzThe4v",
        key_secret : "67N5JnK3aiITUiQVHNR6JLOy"
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

app.get("/payment/:paymentId", async(req, res) => {
    const {paymentId} = req.params;

    const razorpay = new Razorpay({
        key_id: "rzp_test_zi4jtbenzThe4v",
        key_secret:"67N5JnK3aiITUiQVHNR6JLOy"
    })
    
    try {
        const payment = await razorpay.payments.fetch(paymentId)

        if (!payment){
            return res.status(500).json("Error at razorpay loading")
        }

        res.json({
            status: payment.status,
            method: payment.method,
            amount: payment.amount,
            currency: payment.currency
        })
    } catch(error) {
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
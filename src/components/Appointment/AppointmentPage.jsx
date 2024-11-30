import React, { useEffect, useState } from "react";
import Footer from "../Shared/Footer/Footer";
import Header from "../Shared/Header/Header";
import CheckoutPage from "../Booking/BookingCheckout/CheckoutPage";
import PersonalInformation from "../Booking/PersonalInformation";
import { Button, Steps, message } from "antd";
import moment from "moment";
import SelectApppointment from "./SelectApppointment";
import useAuthCheck from "../../redux/hooks/useAuthCheck";
import { useCreateAppointmentByUnauthenticateUserMutation } from "../../redux/api/appointmentApi";
import { useDispatch } from "react-redux";
import { addInvoice } from "../../redux/feature/invoiceSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

let initialValue = {
  paymentMethod: 'paypal',
  paymentType: 'creditCard',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  reasonForVisit: '',
  description: '',
  address: '',
  nameOnCard: '',
  cardNumber: '',
  expiredMonth: '',
  cardExpiredYear: '',
  cvv: '',
}
const AppointmentPage = () => {
  const dispatch = useDispatch();
  const { data, role } = useAuthCheck();
  const [current, setCurrent] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectTime, setSelectTime] = useState('');
  const [isCheck, setIsChecked] = useState(false);
  const [selectValue, setSelectValue] = useState(initialValue);
  const [IsDisable, setIsDisable] = useState(true);
  const [isConfirmDisable, setIsConfirmDisable] = useState(true);
  const [patientId, setPatientId] = useState('');
  const [responseId, setResponseId] = React.useState("");

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = src;

      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }

      document.body.appendChild(script);
    })
  }

  const navigation = useNavigate();

  const [createAppointmentByUnauthenticateUser, { data: appointmentData, isError, isSuccess, isLoading, error }] = useCreateAppointmentByUnauthenticateUserMutation()

  const handleChange = (e) => { setSelectValue({ ...selectValue, [e.target.name]: e.target.value }) };

  const next = () => { setCurrent(current + 1) };
  const prev = () => { setCurrent(current - 1) };

  useEffect(() => {
    const { firstName, lastName, email, phone, nameOnCard, cardNumber, expiredMonth, cardExpiredYear, cvv, reasonForVisit } = selectValue;
    const isInputEmpty = !firstName || !lastName || !email || !phone || !reasonForVisit;
    const isConfirmInputEmpty = !nameOnCard || !cardNumber || !expiredMonth || !cardExpiredYear || !cvv || !isCheck;
    setIsDisable(isInputEmpty);
    setIsConfirmDisable(isConfirmInputEmpty);
  }, [selectValue, isCheck]);

  // const handleConfirmSchedule = () => {
  const obj = {};
  obj.patientInfo = {
    firstName: selectValue.firstName,
    lastName: selectValue.lastName,
    email: selectValue.email,
    phone: selectValue.phone,
    patientId: role !== '' && role === 'patient' ? data?.id:undefined,
    scheduleDate: selectedDate,
    scheduleTime: selectTime,
  }
  obj.payment = {
    paymentType: selectValue.paymentType,
    paymentMethod: selectValue.paymentMethod,
    cardNumber: selectValue.cardNumber,
    cardExpiredYear: selectValue.cardExpiredYear,
    cvv: selectValue.cvv,
    expiredMonth: selectValue.expiredMonth,
    nameOnCard: selectValue.nameOnCard
  }
  //   createAppointmentByUnauthenticateUser(obj)
  // }

  const createRazorpayOrder = () => {
   let dataa = JSON.stringify({
      amount: 10 * 100, // Convert to paise
      currency: "INR",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5050/createpayment",
      headers: {
        'Content-Type': 'application/json'
      },
      data: dataa
    }

    axios.request(config)
      .then((response) => {
        console.log('test', JSON.stringify(response.data))
        handleRazorpayScreen(response.data)
      })
      .catch((error) => {
        console.log("error at", error)
      })
  }

  const handleRazorpayScreen = async (orderdata) => {
    console.log("orderdata", orderdata)
    const res = await loadScript("https:/checkout.razorpay.com/v1/checkout.js")

    if (!res) {
      alert("Some error at razorpay screen loading")
      return;
    }

    const options = {
      "key": process.env.REACT_APP_API_KEY_RAZORPAY,
      "amount": orderdata.amount,
      "currency": 'INR',
      "name": "24x7 Doctor",
      "description": "Payment for the appointment Booking",
      "image": "https://papayacoders.com/demo.png",
      "order_id": orderdata.order_id,
      handler: function (response) {
        console.log('razorpay response', response)
        setResponseId(response.razorpay_payment_id)
        verifypayment(response)
      },
      prefill: {
        name: "24x7 Doctor",
        email: "singhravi99933@gmail.com"
      },
      theme: {
        color: "#F4C430"
      }
    }

    const paymentObject = new window.Razorpay(options)
    console.log('paymentObject', paymentObject)
    paymentObject.open()
    paymentObject.on('payment.failed', function (response) {
      console.log("payment.response", response)
    })
  }


  const verifypayment = async (paymentdata) => {
    console.log("verifydata", paymentdata)
    let abcd = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:5050/payment/${paymentdata.razorpay_payment_id}`,
      headers: {
        'Content-Type': 'application/json'
      },
    }

    axios.request(abcd)
      .then((response) => {
        console.log('payment varification ', JSON.stringify(response.data))
        response && createAppointmentByUnauthenticateUser(obj)
      })
      .catch((error) => {
        console.log("error at", error)
      })

  }

  useEffect(() => {
    if (isSuccess) {
      message.success("Succcessfully Appointment Scheduled")
      setSelectValue(initialValue);
      console.log("appoint data", appointmentData)
      dispatch(addInvoice({ ...appointmentData }))
      navigation(`/booking/success/${appointmentData?.id}`)
    }
    if (isError) {
      message.error(error?.data?.message);
    }
  }, [isSuccess, isError, isLoading, appointmentData])

  const handleDateChange = (date) => { setSelectedDate(moment(date).format('YYYY-MM-DD HH:mm:ss')) }

  const steps = [
    {
      title: 'Select Appointment Date & Time',
      content: <SelectApppointment
        handleDateChange={handleDateChange}
        selectedDate={selectedDate}
        selectTime={selectTime}
        setSelectTime={setSelectTime}
      />
    },
    {
      title: 'Patient Information',
      content: <PersonalInformation handleChange={handleChange} selectValue={selectValue} setPatientId={setPatientId} />
    },
    {
      title: 'Payment',
      content: <CheckoutPage
        handleChange={handleChange}
        selectValue={selectValue}
        isCheck={isCheck}
        setIsChecked={setIsChecked}
        data={false}
        selectedDate={selectedDate}
        selectTime={selectTime}
      />,
    },
  ]

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }))

  return (
    <>
      <Header />
      <div className="container" style={{ marginTop: '8rem', bottom: '5rem' }}>
        <div className="container" style={{ marginBottom: '12rem', marginTop: '8rem' }}>
          <Steps current={current} items={items} />
          <div className='mb-5 mt-3 mx-3'>{steps[current].content}</div>
          <div className='text-end mx-3' >
            {current < steps.length - 1 && (
              <Button type="primary" size="large"
                disabled={current === 0 ? (selectTime ? false : true) : IsDisable || !selectTime}
                onClick={() => next()}>Next</Button>)}

            {/* {current === steps.length - 1 && (<Button type="primary" size="large" disabled={isConfirmDisable} loading={isLoading} onClick={handleConfirmSchedule}>Confirm</Button>)} */}
            {current === steps.length - 1 && (<Button type="primary" size="large" loading={isLoading} onClick={createRazorpayOrder}>Confirm</Button>)}

            {current > 0 && (<Button style={{ margin: '0 8px', }} size="large" onClick={() => prev()} >Previous</Button>)}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AppointmentPage
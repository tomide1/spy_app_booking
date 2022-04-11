import React, { useState, useEffect } from "react";

import { getSlots, saveAppointment } from "../firebase";

const CalendarForm = () => {
	const [selectedDate, setSelectedDate] = useState("01/03/2022");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [timeSlots, setTimeSlots] = useState([]);
	const [selectedTimes, setSelectedTimes] = useState(new Map());

	var freeSlots = {};

	useEffect(() => {
    getSlots()
		.then(
			items => items.forEach(
				item => {
					var timeData = item.data();
					freeSlots[timeData.date.toString()] = timeData.times;
				}
			)
		);
  }, [freeSlots]);

	const handleDateUpdate = (e) => {
		var dateElem = e.currentTarget.getElementsByClassName("selected")[0]; 
		if (dateElem == null || undefined)
			return;

		var milliDate = dateElem.getAttribute("data-date");
		var date = new Date(milliDate * 1).toLocaleString().split(',')[0];
		setSelectedDate(date);
		// console.log(date);

		var timeSlotForDate = freeSlots[date];
		setTimeSlots(timeSlotForDate);
		// console.log(timeSlotForDate);
	}

	const handleCheckboxSelected = (e) => {
		var key = e.currentTarget.getAttribute('id')
		var value = e.currentTarget.getAttribute('data-value');

		if (e.target.checked) {
			setSelectedTimes(new Map(selectedTimes.set(key, value)));
		} else {
			selectedTimes.delete(key);
			setSelectedTimes(new Map(selectedTimes));
		}
		console.log(selectedTimes);
		console.log(Array.from(selectedTimes.values()));
	}

	const handleEmailUpdate = (e) => {
		var value = e.currentTarget.value;
		setEmail(value);
	}

	const handlePhoneNumberUpdate = (e) => {
		var value = e.currentTarget.value;
		setPhoneNumber(value);
	}

	const handleBooking = (e) => {
		e.preventDefault();
		if (selectedDate === null || selectedDate === undefined 
			|| timeSlots.length < 1 || email === null || email === ""
			|| phoneNumber === null || phoneNumber === "") {
				alert("Please make sure you have completed all fields!");
				return;
		}

		var appointment = {
			date: selectedDate,
			times: Array.from(selectedTimes.values()),
			email: email,
			phoneNumber: phoneNumber
		};

		saveAppointment(appointment);
		alert(`You have successfully booked your appointment for ${appointment.date}`);

		setSelectedDate("01/03/2022");
		setEmail("");
	  setPhoneNumber("");
		setTimeSlots([]);

		document.getElementsByName("floating_email")[0].value = '';
		document.getElementsByName("floating_phone")[0].value = '';
	}

	var timeSlotElems = timeSlots && timeSlots.length > 0 ? timeSlots.map((slot, index) => {
		return <div key={`checkbox-${index}`} className="flex items-center mb-4">
			<input 
				id={`checkbox-${index}`} 
				aria-describedby={`checkbox-${index}`} 
				type="checkbox" 
				onChange={(e) => handleCheckboxSelected(e)}
				data-value={slot}
				className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
			<label htmlFor={`checkbox-${index}`} className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
				{slot}
			</label>
		</div>;
	}) : <div>N/A</div>;

	return (
		<div className="mx-8 my-10">
			<h1 className="mb-2">1.) Choose a date: {selectedDate}</h1>
			<div 
				className="mb-6"
				onClick={(e) => handleDateUpdate(e)}
				inline-datepicker="" 
				// datepicker-buttons=""
				datepicker-format="dd/mm/yyyy"
				data-date={selectedDate}>
			</div>

			<h1 className="mb-2">2.) Select a time</h1>

			<fieldset className="mb-6">
				<legend className="sr-only">Available appointment times</legend>
				{ timeSlotElems }
			</fieldset>

			<h1 className="mb-2">3.) Enter your email address and phone number</h1>

			<div className="mb-6">
				<div className="grid xl:grid-cols-2 xl:gap-6">
					<div className="relative z-0 mb-6 w-full group">
						<input 
							type="email" 
							name="floating_email" 
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
							placeholder=" " 
							required=""
							onChange={(e) => handleEmailUpdate(e)}/>
						<label htmlFor="floating_email" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
					</div>
				</div>
				
				<div className="grid xl:grid-cols-2 xl:gap-6">
					<div className="relative z-0 mb-6 w-full group">
						<input 
							type="tel" 
							pattern="[0-9]{4}[0-9]{3}[0-9]{4}" 
							name="floating_phone" 
							id="floating_phone" 
							className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
							placeholder=" " 
							required=""
							onChange={(e) => handlePhoneNumberUpdate(e)}/>
						<label htmlFor="floating_phone" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number (01234567890)</label>
					</div>
				</div>
			</div>

			<button 
				type="button" 
				onClick={(e) => handleBooking(e)}
				className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
					Book
				</button>
		</div>

	)
}

export default CalendarForm;

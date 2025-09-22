import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";

const CinemaSeatBooking = ({
    layout = {
        rows: 8,
        seatperrow: 12,
        aiselePosition: 5
    },
    seatType = {
        regular: { name: "Regular", price: 150, rows: [0, 1, 2] },
        premium: { name: "Premium", price: 250, rows: [3, 4, 5] },
        vip: { name: "VIP", price: 350, rows: [6, 7] },
    },
    bookedSeats = [],
    currency = "₹",
    onBookingComplete = () => { },
    title = "Cinema Hall Booking",
    subtitle = "Select your favourite seats",
}) => {
    const colors = [
        "blue",
        "purple",
        "yellow",
        "green",
        "red",
        "indigo",
        "pink",
        "gray",
    ];

    const getSeatType = (row) => {
        const seatTypeEntries = Object.entries(seatType);
        for (let i = 0; i < seatTypeEntries.length; i++) {
            const [type, config] = seatTypeEntries[i];
            if (config.rows.includes(row)) {
                const color = colors[i % colors.length];
                return {
                    type, color, ...config
                };
            }
        }
        const [firstType, firstConfig] = seatTypeEntries[0];
        return { type: firstType, color: colors[0], ...firstConfig };
    };

    const initializeSeats = useMemo(() => {
        const seats = [];
        for (let row = 0; row < layout.rows; row++) {
            const seatRow = [];
            const seatTypeInfo = getSeatType(row);

            for (let seat = 0; seat < layout.seatperrow; seat++) {
                const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`;

                seatRow.push({
                    id: seatId,
                    row,
                    seat,
                    type: seatTypeInfo?.type || "regular",
                    price: seatTypeInfo?.price || 150,
                    color: seatTypeInfo?.color || "blue",
                    status: bookedSeats.includes(seatId) ? "booked" : "available",
                    selected: false,
                });
            }
            seats.push(seatRow);
        }
        return seats;
    }, [layout, seatType, bookedSeats]);

    const [seats, setSeats] = useState(initializeSeats);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const navigate = useNavigate();
    const { location, movie } = useParams();

    const getColorClass = (colorName) => {
        const colorMap = {
            blue: "bg-blue-200 border-blue-400 text-blue-800 hover:bg-blue-300",
            purple: "bg-purple-200 border-purple-400 text-purple-800 hover:bg-purple-300",
            yellow: "bg-yellow-200 border-yellow-400 text-yellow-800 hover:bg-yellow-300",
            green: "bg-green-200 border-green-400 text-green-800 hover:bg-green-300",
            red: "bg-red-200 border-red-400 text-red-800 hover:bg-red-300",
            indigo: "bg-indigo-200 border-indigo-400 text-indigo-800 hover:bg-indigo-300",
            pink: "bg-pink-200 border-pink-400 text-pink-800 hover:bg-pink-300",
            gray: "bg-gray-200 border-gray-400 text-gray-800 hover:bg-gray-300",
        };
        return colorMap[colorName] || colorMap.blue;
    };

    const getSeatClassName = (seat) => {
        const baseClass =
            "w-9 h-9 sm:w-11 sm:h-11 lg:w-14 lg:h-14 m-1 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs sm:text-base font-bold shadow-md";

        if (seat.status === "booked") {
            return `${baseClass} bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed opacity-60`
        }
        if (seat.selected) {
            return `${baseClass} bg-gradient-to-br from-green-400 to-green-600 border-green-700 text-white scale-110 shadow-lg ring-2 ring-green-300`;
        }
        return `${baseClass} ${getColorClass(seat.color)} hover:scale-105 hover:shadow-lg`;
    };

    // Fix: Use prevSeats for accurate selection state
    const handleSeatClick = (rowIndex, seatIndex) => {
        setSeats(prevSeats => {
            const newSeats = prevSeats.map((row, rIdx) =>
                row.map((seat, sIdx) => {
                    if (rIdx === rowIndex && sIdx === seatIndex && seat.status === "available") {
                        return { ...seat, selected: !seat.selected };
                    }
                    return seat;
                })
            );
            // Update selectedSeats based on newSeats
            const newlySelected = [];
            newSeats.forEach(row =>
                row.forEach(seat => {
                    if (seat.selected && seat.status === "available") {
                        newlySelected.push(seat.id);
                    }
                })
            );
            setSelectedSeats(newlySelected);
            return newSeats;
        });
    };

    const renderSeatSection = (SeatRow, StartIndex, endIndex) => (
        <div className="flex">
            {SeatRow.slice(StartIndex, endIndex).map((seat, index) => (
                <button
                    type="button"
                    className={getSeatClassName(seat)}
                    key={seat.id}
                    title={`${seat.id} - ${getSeatType(seat.row)?.name || "Regular"} - ${currency}${seat.price}`}
                    onClick={() => handleSeatClick(seat.row, StartIndex + index)}
                    disabled={seat.status === "booked"}
                    aria-pressed={seat.selected}
                >
                    {StartIndex + index + 1}
                </button>
            ))}
        </div>
    );

    const uniqueSeatTypes = Object.entries(seatType).map(([type, config], index) => ({
        type,
        color: colors[index % colors.length],
        ...config,
    }));

    const handleBooking = () => {
        if (selectedSeats.length === 0) return;
        onBookingComplete(selectedSeats);
        setModalMessage(`Booking successful for seats: ${selectedSeats.join(", ")}`);
        setShowModal(true);
        setSeats(prevSeats =>
            prevSeats.map(row =>
                row.map(seat =>
                    selectedSeats.includes(seat.id)
                        ? { ...seat, status: "booked", selected: false }
                        : seat
                )
            )
        );
        setSelectedSeats([]);
        // Redirect to home after 2 seconds
        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    const getVehicle = (count) => {
        if (count === 1) return "🚲 Cycle";
        if (count === 2) return "🏍️ Bike";
        if (count === 3) return "🛺 Auto";
        if (count === 4) return "🚗 Car";
        if (count >= 5) return "🚌 Bus";
        return "";
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full mx-auto bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-100">
                <h1 className="text-3xl font-extrabold mb-2 text-center text-blue-700 tracking-tight drop-shadow">
                    {title} - {location} - {movie}
                </h1>
                <p className="text-center text-gray-500 mb-8 text-lg">{subtitle}</p>

                {/*Screen*/}
                <div className="mb-10">
                    <div className="w-full h-6 bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 rounded-full mb-2 shadow-lg" />
                    <p className="text-center text-sm text-gray-400 font-semibold tracking-wide">SCREEN</p>
                </div>
                {/*seat map*/}
                <div className="mb-8 overflow-x-auto">
                    <div className="flex flex-col items-center min-w-max">
                        {seats.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex items-center mb-3">
                                <span className="w-8 text-center font-bold text-gray-600 mr-4 text-base">
                                    {String.fromCharCode(65 + rowIndex)}
                                </span>
                                {renderSeatSection(row, 0, layout.aiselePosition)}
                                {/* aisle */}
                                <div className="w-8"></div>
                                {renderSeatSection(row, layout.aiselePosition, layout.seatperrow)}
                            </div>
                        ))}
                    </div>
                </div>

                {/*legend*/}
                <div className="flex flex-wrap justify-center gap-6 mb-8 p-4 bg-gray-50 rounded-xl shadow">
                    {uniqueSeatTypes.map((seatType) => (
                        <div key={seatType.type} className="flex items-center gap-2">
                            <div className={`w-6 h-6 border-2 rounded-xl ${getColorClass(seatType.color)}`} />
                            <span className="text-sm font-medium text-gray-700">
                                {seatType.name} <span className="text-xs text-gray-500">({currency}{seatType.price})</span>
                            </span>
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 border-2 border-green-700 rounded-xl" />
                        <span className="text-sm font-medium text-gray-700">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded-xl opacity-60" />
                        <span className="text-sm font-medium text-gray-700">Booked</span>
                    </div>
                </div>
                {/* booking Summary */}
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 shadow-lg mb-6 sticky top-4">
                    <h2 className="text-xl font-bold mb-3 text-blue-700 flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Booking Summary
                    </h2>
                    {selectedSeats.length === 0 ? (
                        <p className="text-gray-500">No seats selected.</p>
                    ) : (
                        <div>
                            <div className="mb-2">
                                <span className="font-medium">Selected Seats:</span>
                                <span className="ml-2">
                                    {selectedSeats.join(", ")}
                                </span>
                            </div>
                            <div className="mb-2">
                                <span className="font-medium">Total Price:</span>
                                <span className="ml-2">
                                    {currency}
                                    {selectedSeats.reduce((total, seatId) => {
                                        for (let row of seats) {
                                            for (let seat of row) {
                                                if (seat.id === seatId) {
                                                    return total + seat.price;
                                                }
                                            }
                                        }
                                        return total;
                                    }, 0)}
                                </span>
                            </div>
                            <div className="mb-2">
                                <span className="font-medium">Vehicle:</span>
                                <span className="ml-2">{getVehicle(selectedSeats.length)}</span>
                            </div>
                            <button
                                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold text-base hover:bg-blue-700 transition disabled:opacity-50 shadow"
                                onClick={handleBooking}
                                disabled={selectedSeats.length === 0}
                            >
                                Book Now
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal Popup */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                            <h3 className="text-xl font-bold text-green-600 mb-4">Booking Confirmed!</h3>
                            <p className="mb-4">{modalMessage}</p>
                            <p className="mb-4 text-gray-700">
                                Remaining available seats: {
                                    seats.flat().filter(seat => seat.status === "available").length
                                }
                            </p>
                            <button
                                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CinemaSeatBooking
import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { donationService } from "../services";

const Donate = () => {
  const [transactionMethod, setTransactionMethod] = useState("scratch card");
  const [scratchCardType, setScratchCardType] = useState("");
  const [scratchCardValue, setScratchCardValue] = useState("");
  const [scratchCardSerial, setScratchCardSerial] = useState("");
  const [scratchCardCode, setScratchCardCode] = useState("");
  const [copyButtonClicked, setCopyButtonClicked] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const copyContent = (input, buttonId) => {
    navigator.clipboard.writeText(input);
    setCopyButtonClicked(buttonId);
    setTimeout(() => setCopyButtonClicked(""), 2000);
  };

  const getAmountFromValue = (value) => {
    const amounts = {
      "10k": 10000,
      "20k": 20000,
      "30k": 30000,
      "50k": 50000,
      "100k": 100000,
      "200k": 200000,
      "300k": 300000,
      "500k": 500000,
      "1000k": 1000000,
    };
    return amounts[value] || 0;
  };

  const handleRechargeScratchCard = async () => {
    setError("");

    if (!scratchCardType || !scratchCardValue || !scratchCardSerial || !scratchCardCode) {
      setError("Vui lòng điền đầy đủ thông tin thẻ cào");
      return;
    }

    setLoading(true);
    try {
      const response = await donationService.createDonation({
        method: "scratch_card",
        amount: getAmountFromValue(scratchCardValue),
        scratchCardInfo: {
          cardType: scratchCardType,
          serial: scratchCardSerial,
          code: scratchCardCode,
        },
      });

      if (response.success) {
        setSuccess(true);
        setScratchCardCode("");
        setScratchCardSerial("");
        setScratchCardValue("");
        setScratchCardType("");
        
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Giao dịch không thành công");
    }
    setLoading(false);
  };

  const handleOtherDonation = async (method, amount = 50000) => {
    setLoading(true);
    try {
      const response = await donationService.createDonation({
        method,
        amount,
        note: `Donation via ${method}`,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    }
    setLoading(false);
  };

  return (
    <div className="relative mx-0 mb-4 mt-2 py-6 text-xs shadow-md md:px-20 md:py-12 md:text-sm lg:mx-32 lg:text-base">
      <p className="mb-3 ml-3 text-lg font-semibold text-gray-800 md:ml-0 lg:text-2xl">
        Ủng hộ cho eShelf
      </p>
      <p className="ml-3 w-full text-gray-700 md:ml-0 md:w-[68%]">
        Chân thành cảm ơn đóng góp của bạn! Sự hỗ trợ của bạn không chỉ giúp
        chúng tôi cải thiện website mà còn là nguồn động lực để chúng tôi tiếp
        tục phát triển.
      </p>

      {success && (
        <div className="mx-3 mt-4 flex items-center gap-2 rounded bg-green-100 p-3 text-green-700 md:mx-0">
          <CheckCircle size={20} />
          <span>Giao dịch thành công. Chúc bạn nhiều sức khoẻ, may mắn!</span>
        </div>
      )}

      {error && (
        <div className="mx-3 mt-4 rounded bg-red-100 p-3 text-red-600 md:mx-0">
          {error}
        </div>
      )}

      <ul className="max-w-screen mt-3 flex text-white">
        <li
          onClick={() => setTransactionMethod("scratch card")}
          className={`cursor-pointer select-none ${transactionMethod === "scratch card" ? "bg-slate-950 underline" : "bg-slate-800"} p-1.5 md:px-6 md:py-3`}
        >
          Qua thẻ cào
        </li>
        <li
          onClick={() => setTransactionMethod("momo")}
          className={`cursor-pointer select-none p-1.5 md:px-6 md:py-3 ${transactionMethod === "momo" ? "bg-slate-950 underline" : "bg-slate-800"}`}
        >
          Qua Momo
        </li>
        <li
          onClick={() => setTransactionMethod("atm")}
          className={`cursor-pointer select-none p-1.5 md:px-6 md:py-3 ${transactionMethod === "atm" ? "bg-slate-950 underline" : "bg-slate-800"}`}
        >
          Qua ATM
        </li>
        <li
          onClick={() => setTransactionMethod("paypal")}
          className={`cursor-pointer select-none p-1.5 md:px-6 md:py-3 ${transactionMethod === "paypal" ? "bg-slate-950 underline" : "bg-slate-800"}`}
        >
          Qua PayPal
        </li>
      </ul>

      {transactionMethod === "scratch card" ? (
        <div className="flex max-w-full flex-col gap-3 rounded rounded-tl-none bg-slate-950 px-4 py-10 sm:max-w-screen-sm md:max-w-screen-md md:px-16 lg:max-w-screen-lg xl:max-w-screen-xl">
          <select
            className="rounded p-2"
            value={scratchCardType}
            onChange={(e) => setScratchCardType(e.target.value)}
            disabled={loading}
          >
            <option value="">Chọn loại thẻ</option>
            <option value="viettel">Viettel</option>
            <option value="vinaphone">VinaPhone</option>
            <option value="mobifone">MobiFone</option>
          </select>
          <select
            className="rounded p-2"
            value={scratchCardValue}
            onChange={(e) => setScratchCardValue(e.target.value)}
            disabled={loading}
          >
            <option value="">Chọn mệnh giá thẻ</option>
            <option value="10k">10.000</option>
            <option value="20k">20.000</option>
            <option value="30k">30.000</option>
            <option value="50k">50.000</option>
            <option value="100k">100.000</option>
            <option value="200k">200.000</option>
            <option value="300k">300.000</option>
            <option value="500k">500.000</option>
            <option value="1000k">1.000.000</option>
          </select>
          <input
            type="text"
            placeholder="Nhập serial"
            value={scratchCardSerial}
            onChange={(e) => setScratchCardSerial(e.target.value)}
            className="rounded p-2 focus:outline-none"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Nhập mã thẻ"
            value={scratchCardCode}
            onChange={(e) => setScratchCardCode(e.target.value)}
            className="rounded p-2 focus:outline-none"
            disabled={loading}
          />
          <button
            className="flex w-32 items-center justify-center gap-2 rounded bg-yellow-600 py-2 text-white hover:bg-yellow-700 disabled:bg-yellow-800"
            onClick={handleRechargeScratchCard}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Xác nhận
          </button>
        </div>
      ) : transactionMethod === "momo" ? (
        <div className="flex max-w-full justify-around rounded rounded-tl-none bg-slate-950 py-10 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
          <img
            src="/images/random-qr-code.jpg"
            alt="QRCode Momo"
            title="QRCode Momo"
            className="h-32 md:h-72"
            loading="lazy"
          />
          <div className="font-semibold text-white md:pt-10">
            <div className="relative w-44 md:w-80">
              <p className="text-red-500">Số điện thoại</p>
              <p>0123456789</p>
              <button
                className="absolute right-0 top-1/2 w-16 translate-y-[-50%] transform rounded bg-yellow-600 py-1 text-white md:w-28"
                onClick={() => copyContent("0123456789", "momo-sdt")}
              >
                {copyButtonClicked === "momo-sdt" ? "Đã copy" : "Copy"}
              </button>
            </div>
            <div className="relative my-6 w-44 md:w-80">
              <p className="text-red-500">Chủ tài khoản</p>
              <p>Lê Văn Vũ</p>
              <button
                className="absolute right-0 top-1/2 w-16 translate-y-[-50%] transform rounded bg-yellow-600 py-1 text-white md:w-28"
                onClick={() => copyContent("Lê Văn Vũ", "momo-ten")}
              >
                {copyButtonClicked === "momo-ten" ? "Đã copy" : "Copy"}
              </button>
            </div>
            <p className="w-40 text-gray-400 md:w-full">
              <em>Chúng tôi rất cảm kích sự rộng lượng của bạn!</em>
            </p>
          </div>
        </div>
      ) : transactionMethod === "atm" ? (
        <div className="flex max-w-full justify-around rounded rounded-tl-none bg-slate-950 py-10 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
          <img
            src="/images/random-qr-code.jpg"
            alt="QRCode ATM"
            title="QRCode ATM"
            className="h-32 md:h-72"
            loading="lazy"
          />
          <div className="font-semibold text-white md:pt-9">
            <p>Ngân hàng AZBank</p>
            <div className="relative mt-6 w-44 md:w-80">
              <p className="text-red-500">Số tài khoản</p>
              <p>12345556789</p>
              <button
                className="absolute right-0 top-1/2 w-16 translate-y-[-50%] transform rounded bg-yellow-600 py-1 text-white md:w-28"
                onClick={() => copyContent("12345556789", "atm-sdt")}
              >
                {copyButtonClicked === "atm-sdt" ? "Đã copy" : "Copy"}
              </button>
            </div>
            <div className="relative my-6 mt-6 w-44 md:w-80">
              <p className="text-red-500">Chủ tài khoản</p>
              <p>Lê Văn Vũ</p>
              <button
                className="absolute right-0 top-1/2 w-16 translate-y-[-50%] transform rounded bg-yellow-600 py-1 text-white md:w-28"
                onClick={() => copyContent("Lê Văn Vũ", "atm-ten")}
              >
                {copyButtonClicked === "atm-ten" ? "Đã copy" : "Copy"}
              </button>
            </div>
            <p className="w-40 text-gray-400 md:w-full">
              <em>Chúng tôi rất cảm kích sự rộng lượng của bạn!</em>
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-full rounded rounded-tl-none bg-slate-950 py-16 text-center text-white sm:max-w-screen-sm md:max-w-screen-md md:py-36 lg:max-w-screen-lg xl:max-w-screen-xl">
          <p>
            Bạn có thể ủng hộ chúng tôi qua PayPal:&nbsp;
            <a
              href="https://www.paypal.com/vn/home"
              title="PayPal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 underline transition-all delay-100 hover:text-red-200"
            >
              Click Here
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Donate;

import { format, differenceInDays, formatDistanceToNow } from 'date-fns';


export default function PaymentHistory({ fees }) {
  const formatedDate = (dateStr) => {
    const date = new Date(dateStr);
    const formattedTime = format(date, 'dd-MM-yyyy');;
    return formattedTime;
  };

  // Calculate total paid
  const course = fees[0]
  const coursePrice = parseFloat(course.fee_amount.replace('$', '').replace(',', ''));
  const totalPaid = fees.reduce((acc, fee) => acc + parseFloat(fee.paid.replace('$', '').replace(',', '')), 0);
  
  // Calculate remaining amount for each fee
  const feesWithRemaining = fees.map(fee => {
    const feeAmount = parseFloat(fee.fee_amount.replace('$', '').replace(',', ''));
    const paidAmount = parseFloat(fee.paid.replace('$', '').replace(',', ''));
    console.log(feeAmount - paidAmount);
    return {
      ...fee,
      remaining: feeAmount - paidAmount,
    };
  });


  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Fees</h1>
          <p className="mt-2 text-sm text-gray-700">
            A table of placeholder stock market data that does not make any sense.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Export
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                 
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Payment Date
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                 
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {feesWithRemaining.map((fee) => (
                  <tr key={fee.fee_id}>
                    <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                      {formatedDate(fee.payment_date)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{fee.paid}</td>
                    <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      {fee.status}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0" colSpan="2">
                    Total Remaining
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                    ${coursePrice - totalPaid.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

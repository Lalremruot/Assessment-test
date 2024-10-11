import React, { useState } from "react";
import { useEffect } from "react";
import assessmentData from "../data/assessment.json";
import optionsData from "../data/career_options.json";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { useSelector } from "react-redux";

const ITEMS_PER_PAGE = 3;

//load plugins

dayjs.extend(utc);
dayjs.extend(timezone);

const Assessment = () => {
  const [responses, setResponses] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [rankedCareers, setRankedCareers] = useState([]);
  const [dateTime, setDateTime] = useState("");

  const detail = useSelector((state) => state.contact);

  const getISTDateTime = () => {
    return dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"); // Format to IST
  };

  useEffect(() => {
    console.log(rankedCareers);

    const updateDateTime = () => {
      setDateTime(getISTDateTime());
    };
    // Update the date and time immediately
    updateDateTime();
    // Set an interval to update every second
    const intervalId = setInterval(updateDateTime, 1000);
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const categoryNames = rankedCareers.map((subArray) => subArray[0]);
  const category = categoryNames[0];
  //console.log(category)
  const selectedCareers = optionsData[category] || [];

  //console.log(rankedCareers)

  const handleChange = (statement, response) => {
    setResponses((prev) => ({
      ...prev,
      [statement]: response,
    }));
  };

  const calculateWeights = () => {
    const careerScores = {
      AnalyticalThinkers: 0,
      CreativesInnovators: 0,
      PracticalExecutors: 0,
    };

    assessmentData.forEach((item) => {
      const weight = item.weights;
      const response = responses[item.statement];

      if (response) {
        const responseIndex = item.response.indexOf(response);
        if (responseIndex !== -1) {
          const maxWeight = 3 - responseIndex; // Inverse scoring
          careerScores.AnalyticalThinkers +=
            (weight.AnalyticalThinkers * maxWeight) / 3;
          careerScores.CreativesInnovators +=
            (weight.CreativesInnovators * maxWeight) / 3;
          careerScores.PracticalExecutors +=
            (weight.PracticalExecutors * maxWeight) / 3;
        }
      }
    });

    return Object.entries(careerScores).sort(
      ([, scoreA], [, scoreB]) => scoreB - scoreA
    );
  };

  const handleSubmit = () => {
    const results = calculateWeights();
    setRankedCareers(results);
    setSubmitted(true);

    //console.log(rankedCareers[0]);
  };

  //Download result
  const downloadPDF = () => {
    const input = document.getElementById("assessment-result"); // ID of the div to be downloaded
    const options = {
      scale: 2, // Increase scale for higher quality
      useCORS: true, // Use CORS for images
    };

    html2canvas(input, options).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
        floatPrecision: 16,
      });

      const imgWidth = 190; // Adjust based on your PDF size
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("results.pdf"); // Name of the downloaded file
    });
  };

  const paginatedStatements = assessmentData.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(assessmentData.length / ITEMS_PER_PAGE);

  // Check if all responses are filled across all pages
  const allResponsesFilled =
    Object.keys(responses).length === assessmentData.length;

  // Check if all responses for the current page are filled
  const currentPageResponsesFilled = paginatedStatements.every((item) => {
    return responses[item.statement] !== undefined;
  });

  return (
    <>
      {submitted ? (
        <div className="max-w-3xl p-6 sm:p-12 mx-auto bg-gray-200 shadow-lg rounded-lg">
  <div className="p-4 sm:p-6 bg-gray-200 rounded-lg" id="assessment-result">
    <h1 className="mb-4 text-2xl sm:text-4xl font-bold text-gray-900">Assessment Result</h1>
    <div className="mb-6 text-base sm:text-lg text-gray-800">
      <p className="mb-4 text-gray-600">Generated on {dateTime}</p>
      <p className="font-medium">Name: <span className="text-gray-900">{detail.name}</span></p>
      <p className="font-medium">Email: <span className="text-gray-900">{detail.email}</span></p>
      <p className="font-medium">Phone: <span className="text-gray-900">{detail.phone}</span></p>
    </div>
    <p className="mb-6 text-lg sm:text-xl text-gray-800">
      Based on your responses, here are the available careers in{" "}
      <span className="font-semibold text-blue-600">{selectedCareers[0].category}</span>:
    </p>
    <ul className="space-y-4 sm:space-y-6">
      {selectedCareers.map(({ title, description, description2 }, index) => (
        <li key={index} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-600">{title}</h3>
          <p className="text-gray-600">{description}</p>
          {description2 && <p className="text-gray-600">{description2}</p>}
        </li>
      ))}
    </ul>
  </div>
  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6 sm:mt-8">
    <button
      onClick={() => {
        setSubmitted(false);
        setResponses({});
        setCurrentPage(0);
        setRankedCareers([]);
      }}
      className="px-4 sm:px-6 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-lg shadow-md transition duration-200"
    >
      Back to Assessment
    </button>
    <button
      onClick={downloadPDF}
      className="px-4 sm:px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition duration-200"
    >
      Download
    </button>
  </div>
</div>

      
      ) : (
        <div className="max-w-2xl mx-auto bg-gray-300 shadow-lg rounded-lg p-6">
          <h1 className="py-2 mb-4 text-4xl font-semibold text-center text-gray-800">
            Career Assessment
          </h1>
          
          <div className="space-y-6">
            {paginatedStatements.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm"
              >
                <p className="text-lg font-semibold text-gray-700 mb-4">
                  {item.index}. {item.statement}
                </p>
                {item.response.map((option, idx) => (
                  <label
                    key={idx}
                    className="flex items-center mb-2 bg-gray-200 p-2 rounded-xl hover:bg-gray-300"
                  >
                    <input
                      type="radio"
                      name={item.statement}
                      value={option}
                      checked={responses[item.statement] === option}
                      onChange={() => handleChange(item.statement, option)}
                      className="mr-3 w-5 h-5 text-blue-500"
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 gap-44">
            {currentPage > 0 && (
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                className="px-6 py-2 text-white bg-gray-600 w-full hover:bg-gray-700 rounded-lg shadow-md transition duration-200"
              >
                Previous
              </button>
            )}
            {currentPage < totalPages - 1 && currentPageResponsesFilled && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-6 py-2 text-white bg-gray-600 w-full hover:bg-gray-700 rounded-lg shadow-md transition duration-200"
              >
                Next
              </button>
            )}
            {currentPage === totalPages - 1 && allResponsesFilled && (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 w-full rounded-lg shadow-md transition duration-200"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Assessment;

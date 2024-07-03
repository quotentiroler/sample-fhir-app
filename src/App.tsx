import React, { useState, useEffect } from "react";
import "./App.css";
import { Patient } from "fhir/r4";

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      const url = "https://wildfhir4.aegis.net/fhir4-0-1/Patient";

      fetch(url, {
        headers: {
          Accept: "application/fhir+json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => Promise.reject(err));
          }
          return response.json();
        })
        .then((result) => {
          const patientData = result.entry.map(
            (entry: { resource: Patient }) => entry.resource
          );
          setPatients(patientData);
          setErrorMessage(null);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching patients:", error);
          const message =
            error.issue && error.issue.length > 0
              ? error.issue[0].details.text
              : "Server error occurred";
          setErrorMessage(message);
          setIsLoading(false);
        });
    };

    fetchPatients();
  }, []);

  const [selectedPatientId, setSelectedPatientId] = useState<
    string | undefined
  >(undefined);

  const handlePatientClick = (id: string) => {
    setSelectedPatientId(id);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator while loading
  }

  return (
    <div className="App">
      {errorMessage ? (
        <h1 className="text-red-600 font-bold">Error: {errorMessage}</h1>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Patients</h1>
          {patients.map((patient) => (
            <div
              key={patient.id} // Use patient.id instead of index
              className="bg-white shadow-md rounded-lg p-6 mb-4"
              role="button"
              tabIndex={0}
              onClick={() => patient.id && handlePatientClick(patient.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  patient.id && handlePatientClick(patient.id);
                }
              }}
            >
              <p className="mb-2">
                <strong>ID:</strong> {patient.id}
              </p>
              <p className="mb-2">
                <strong>Name:</strong>{" "}
                {patient.name?.[0]?.given?.join(" ") || ""}{" "}
                {patient.name?.[0]?.family}
              </p>
              {selectedPatientId === patient.id && (
                <>
                  <p className="mb-2">
                    <strong>Gender:</strong> {patient.gender}
                  </p>
                  <p className="mb-2">
                    <strong>Birth Date:</strong> {patient.birthDate}
                  </p>
                  {patient.address && patient.address.length > 0 && (
                    <p className="mb-2">
                      <strong>Address:</strong>{" "}
                      {`${patient.address[0].line?.join(", ")}, ${
                        patient.address[0].city
                      }, ${patient.address[0].state}, ${
                        patient.address[0].postalCode
                      }`}
                    </p>
                  )}
                  {patient.telecom && patient.telecom.length > 0 && (
                    <p className="mb-2">
                      <strong>Contact:</strong>{" "}
                      {`${patient.telecom[0].system}: ${patient.telecom[0].value}`}
                    </p>
                  )}
                  {patient.communication &&
                    patient.communication.length > 0 && (
                      <p className="mb-2">
                        <strong>Primary Language:</strong>{" "}
                        {patient.communication[0].language?.text}
                      </p>
                    )}
                  {patient.contact && patient.contact.length > 0 && (
                    <div className="mt-4">
                      <strong>Emergency Contact:</strong>
                      <p className="mt-2">
                        Name: {patient.contact[0].name?.text}
                      </p>
                      <p className="mt-2">
                        Relationship:{" "}
                        {patient.contact[0].relationship?.[0]?.text}
                      </p>
                      {patient.contact[0].telecom && (
                        <p className="mt-2">
                          Contact: {patient.contact[0].telecom[0].system}:{" "}
                          {patient.contact[0].telecom[0].value}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default App;

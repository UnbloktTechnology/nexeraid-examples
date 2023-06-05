import { NextApiRequest, NextApiResponse } from "next";

const data = {
  did: "did:ethr:0x81d786b35f3ea2f39aa17cb18d9772e4ecd97206",
  journeyId: "f4732bab-e378-4bef-bd38-e816a50c12bc",
  datetime: "2023-04-27T13:12:29.816Z",
  type: "IDScan",
  credential: {
    credentialSubject: {
      journeyId: "f4732bab-e378-4bef-bd38-e816a50c12bc",
      highLevelResult: "Refer",
      firstName: "ANGELA",
      middleName: "ZOE",
      lastName: "UK SPECIMEN",
      gender: "FEMALE",
      age: "34",
      citizenship: "GBR",
      documentCategory: "Passport",
      documentName: "United Kingdom - National Passport - Front - 2015",
      documentSide: "Front",
      documentType: "Passport",
      entryDate: "27/04/2023",
      entryTime: "1:07:23.34 PM",
      fullName: "ANGELA ZOE UK SPECIMEN",
      addressLine1: null,
      addressLine2: null,
      birthDate: "1988-12-04",
      birthPlace: "CROYDON",
      highLevelResultDetails: {
        documentOverallValidation: "PASSED",
        documentBlockingPolicy: "PASSED",
        documentExpiry: "PASSED",
        documentSupport: "PASSED",
        documentValidation: "PASSED",
        faceMatchValidation: "FAILED",
        accumulativeLivenessResult: "PASSED",
      },
      faceMatchScore: "0.124319337308407",
      qualityCheckDetails: [
        {
          id: "b45e0833-c726-4c65-bfba-1b07736558ab",
          title: "Full Document In View Check",
          description:
            "Checks if the entire document is presented for processing.",
          state: 1,
        },
        {
          id: "f6651bdc-9c0f-406a-ae03-25212f2032ea",
          title: "Blur Check",
          description:
            "Checks if an input image quality allows for maximum extraction rates and authentication checks.",
          state: 1,
        },
        {
          id: "88a123fc-963a-484c-bf01-8b909034ce56",
          title: "Glare Check",
          description:
            "Checks if an input image lighting conditions allow for maximum extraction rates and authentication checks.",
          state: 1,
        },
        {
          id: "23cb69c7-8d42-4560-b51b-a463bc532280",
          title: "Low Resolution Check",
          description:
            "Checks if an input image resolution allows for maximum extraction rates and authentication checks.",
          state: 1,
        },
      ],
      validationDetails: [
        {
          name: "FaceMatchCheckValidator",
          description: "Face match validator result: Failed",
          result: 2,
        },
        {
          name: "Birth Date In Past Validator",
          description:
            "Verified that the date of birth is before the current system’s date and time.",
          result: 1,
        },
        {
          name: "ICAO Template Check",
          description:
            "Success: If the MRZ location satisfies the ICAO standards.\r\n",
          result: 1,
        },
        {
          name: "DocumentNumber Format Validator",
          description:
            "The value of the DocumentNumber is presented in the expected format for this document type.",
          result: 1,
        },
        {
          name: "BirthDate Cross Reference",
          description:
            "The extraction engine retrieved the values of the BirthDate from the MRZ and the VIZ and found them to be matching.",
          result: 1,
        },
        {
          name: "Birth Date In Range Validator",
          description:
            "Verified that the date of birth is in the expected logical range for holders of this type of documents",
          result: 1,
        },
        {
          name: "BirthDate Format Validator",
          description:
            "The value of the BirthDate is presented in the expected format for this document type.",
          result: 1,
        },
        {
          name: "ExpiryDate Format Validator",
          description:
            "The value of the ExpiryDate is presented in the expected format for this document type.",
          result: 1,
        },
        {
          name: "IssueDate Format Validator",
          description:
            "The value of the IssueDate is presented in the expected format for this document type.",
          result: 1,
        },
        {
          name: "Face Substitution Detection Validator",
          description:
            "There are no signs of the portrait image being swapped or altered.",
          result: 1,
        },
        {
          name: "Issue Date & Expiry Date Validator",
          description:
            "Verified that the date of issue precedes the document’s expiry date.",
          result: 1,
        },
        {
          name: "Birth Date & Issue Date Validator",
          description:
            "Verified that the date of birth precedes the document’s issue date.",
          result: 1,
        },
        {
          name: "Birth Date & Expiry Date Validator",
          description:
            "Verified that the date of birth precedes the document’s expiry date.",
          result: 1,
        },
        {
          name: "DocumentNumber Check Digit Validator",
          description: "Verified that the DocumentNumber is correct.",
          result: 1,
        },
        {
          name: "Issue Date In Past Validator",
          description:
            "Verified that the date of issue is before the current system’s date and time.",
          result: 1,
        },
        {
          name: "LastName Cross Reference",
          description:
            "The extraction engine retrieved the values of the LastName from the MRZ and the VIZ and found them to be matching.",
          result: 1,
        },
        {
          name: "ExpiryDate Cross Reference",
          description:
            "The extraction engine retrieved the values of the ExpiryDate from the MRZ and the VIZ and found them to be matching.",
          result: 1,
        },
        {
          name: "FirstName Cross Reference",
          description:
            "The extraction engine retrieved the values of the FirstName from the MRZ and the VIZ and found them to be matching.",
          result: 1,
        },
        {
          name: "DocumentNumber Cross Reference",
          description:
            "The extraction engine retrieved the values of the DocumentNumber from the MRZ and the VIZ and found them to be matching.",
          result: 1,
        },
        {
          name: "DocumentNumber Presence Check ",
          description: "Verified that the DocumentNumber exists in the VIZ.",
          result: 1,
        },
        {
          name: "BirthPlace Presence Check ",
          description: "Verified that the BirthPlace exists in the VIZ.",
          result: 1,
        },
        {
          name: "ICAO Size Check",
          description:
            "MRZ dimensions satisfy the ISO standards of MRZ dimensions.",
          result: 1,
        },
        {
          name: "LastName Presence Check ",
          description: "Verified that the LastName exists in the VIZ.",
          result: 1,
        },
        {
          name: "FirstName Presence Check ",
          description: "Verified that the FirstName exists in the VIZ.",
          result: 1,
        },
        {
          name: "BirthDate Presence Check ",
          description: "Verified that the BirthDate exists in the VIZ.",
          result: 1,
        },
        {
          name: "IssueDate Presence Check ",
          description: "Verified that the IssueDate exists in the VIZ.",
          result: 1,
        },
        {
          name: "BirthDate Check Digit Validator",
          description: "Verified that the BirthDate is correct.",
          result: 1,
        },
        {
          name: "IssuingAuthority Presence Check ",
          description: "Verified that the IssuingAuthority exists in the VIZ.",
          result: 1,
        },
        {
          name: "MRZCompositeCheckDigit Check Digit Validator",
          description: "Verified that the MRZCompositeCheckDigit is correct.",
          result: 1,
        },
        {
          name: "ExpiryDate Presence Check ",
          description: "Verified that the ExpiryDate exists in the VIZ.",
          result: 1,
        },
        {
          name: "Presence Aggregate Validator",
          description:
            "Success: When all fields which are marked as mandatory exist on the document.",
          result: 1,
        },
        {
          name: "ExpiryDate Check Digit Validator",
          description: "Verified that the ExpiryDate is correct.",
          result: 1,
        },
        {
          name: "MRZFull Length Validator",
          description:
            "If MRZ line length matches value defined by ICAO standard.",
          result: 1,
        },
        {
          name: "Colour Validator",
          description:
            "Validation colour on the white image for either coloured or not.",
          result: 1,
        },
        {
          name: "MRZ Country Code Validator",
          description:
            "MRZ Country Code matched with Country code in Document Information ",
          result: 1,
        },
        {
          name: "Portrait Photo Presence Check Validator",
          description:
            "Success: If portrait photo is located in the expected region\r\n",
          result: 1,
        },
        {
          name: "Recapture Detection Validator",
          description: "This document was not checked for signs of Recapture",
          result: 3,
        },
      ],
      id: "did:ethr:0x81d786b35f3ea2f39aa17cb18d9772e4ecd97206",
    },
    issuer: {
      id: "did:web:example.com",
    },
    type: ["VerifiableCredential", "IDScan"],
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    issuanceDate: "2023-04-27T13:12:29.000Z",
    proof: {
      type: "JwtProof2020",
      jwt: "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiSURTY2FuIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImpvdXJuZXlJZCI6ImY0NzMyYmFiLWUzNzgtNGJlZi1iZDM4LWU4MTZhNTBjMTJiYyIsImhpZ2hMZXZlbFJlc3VsdCI6IlJlZmVyIiwiZmlyc3ROYW1lIjoiQU5HRUxBIiwibWlkZGxlTmFtZSI6IlpPRSIsImxhc3ROYW1lIjoiVUsgU1BFQ0lNRU4iLCJnZW5kZXIiOiJGRU1BTEUiLCJhZ2UiOiIzNCIsImNpdGl6ZW5zaGlwIjoiR0JSIiwiZG9jdW1lbnRDYXRlZ29yeSI6IlBhc3Nwb3J0IiwiZG9jdW1lbnROYW1lIjoiVW5pdGVkIEtpbmdkb20gLSBOYXRpb25hbCBQYXNzcG9ydCAtIEZyb250IC0gMjAxNSIsImRvY3VtZW50U2lkZSI6IkZyb250IiwiZG9jdW1lbnRUeXBlIjoiUGFzc3BvcnQiLCJlbnRyeURhdGUiOiIyNy8wNC8yMDIzIiwiZW50cnlUaW1lIjoiMTowNzoyMy4zNCBQTSIsImZ1bGxOYW1lIjoiQU5HRUxBIFpPRSBVSyBTUEVDSU1FTiIsImFkZHJlc3NMaW5lMSI6bnVsbCwiYWRkcmVzc0xpbmUyIjpudWxsLCJiaXJ0aERhdGUiOiIxOTg4LTEyLTA0IiwiYmlydGhQbGFjZSI6IkNST1lET04iLCJoaWdoTGV2ZWxSZXN1bHREZXRhaWxzIjp7ImRvY3VtZW50T3ZlcmFsbFZhbGlkYXRpb24iOiJQQVNTRUQiLCJkb2N1bWVudEJsb2NraW5nUG9saWN5IjoiUEFTU0VEIiwiZG9jdW1lbnRFeHBpcnkiOiJQQVNTRUQiLCJkb2N1bWVudFN1cHBvcnQiOiJQQVNTRUQiLCJkb2N1bWVudFZhbGlkYXRpb24iOiJQQVNTRUQiLCJmYWNlTWF0Y2hWYWxpZGF0aW9uIjoiRkFJTEVEIiwiYWNjdW11bGF0aXZlTGl2ZW5lc3NSZXN1bHQiOiJQQVNTRUQifSwiZmFjZU1hdGNoU2NvcmUiOiIwLjEyNDMxOTMzNzMwODQwNyIsInF1YWxpdHlDaGVja0RldGFpbHMiOlt7ImlkIjoiYjQ1ZTA4MzMtYzcyNi00YzY1LWJmYmEtMWIwNzczNjU1OGFiIiwidGl0bGUiOiJGdWxsIERvY3VtZW50IEluIFZpZXcgQ2hlY2siLCJkZXNjcmlwdGlvbiI6IkNoZWNrcyBpZiB0aGUgZW50aXJlIGRvY3VtZW50IGlzIHByZXNlbnRlZCBmb3IgcHJvY2Vzc2luZy4iLCJzdGF0ZSI6MX0seyJpZCI6ImY2NjUxYmRjLTljMGYtNDA2YS1hZTAzLTI1MjEyZjIwMzJlYSIsInRpdGxlIjoiQmx1ciBDaGVjayIsImRlc2NyaXB0aW9uIjoiQ2hlY2tzIGlmIGFuIGlucHV0IGltYWdlIHF1YWxpdHkgYWxsb3dzIGZvciBtYXhpbXVtIGV4dHJhY3Rpb24gcmF0ZXMgYW5kIGF1dGhlbnRpY2F0aW9uIGNoZWNrcy4iLCJzdGF0ZSI6MX0seyJpZCI6Ijg4YTEyM2ZjLTk2M2EtNDg0Yy1iZjAxLThiOTA5MDM0Y2U1NiIsInRpdGxlIjoiR2xhcmUgQ2hlY2siLCJkZXNjcmlwdGlvbiI6IkNoZWNrcyBpZiBhbiBpbnB1dCBpbWFnZSBsaWdodGluZyBjb25kaXRpb25zIGFsbG93IGZvciBtYXhpbXVtIGV4dHJhY3Rpb24gcmF0ZXMgYW5kIGF1dGhlbnRpY2F0aW9uIGNoZWNrcy4iLCJzdGF0ZSI6MX0seyJpZCI6IjIzY2I2OWM3LThkNDItNDU2MC1iNTFiLWE0NjNiYzUzMjI4MCIsInRpdGxlIjoiTG93IFJlc29sdXRpb24gQ2hlY2siLCJkZXNjcmlwdGlvbiI6IkNoZWNrcyBpZiBhbiBpbnB1dCBpbWFnZSByZXNvbHV0aW9uIGFsbG93cyBmb3IgbWF4aW11bSBleHRyYWN0aW9uIHJhdGVzIGFuZCBhdXRoZW50aWNhdGlvbiBjaGVja3MuIiwic3RhdGUiOjF9XSwidmFsaWRhdGlvbkRldGFpbHMiOlt7Im5hbWUiOiJGYWNlTWF0Y2hDaGVja1ZhbGlkYXRvciIsImRlc2NyaXB0aW9uIjoiRmFjZSBtYXRjaCB2YWxpZGF0b3IgcmVzdWx0OiBGYWlsZWQiLCJyZXN1bHQiOjJ9LHsibmFtZSI6IkJpcnRoIERhdGUgSW4gUGFzdCBWYWxpZGF0b3IiLCJkZXNjcmlwdGlvbiI6IlZlcmlmaWVkIHRoYXQgdGhlIGRhdGUgb2YgYmlydGggaXMgYmVmb3JlIHRoZSBjdXJyZW50IHN5c3RlbeKAmXMgZGF0ZSBhbmQgdGltZS4iLCJyZXN1bHQiOjF9LHsibmFtZSI6IklDQU8gVGVtcGxhdGUgQ2hlY2siLCJkZXNjcmlwdGlvbiI6IlN1Y2Nlc3M6IElmIHRoZSBNUlogbG9jYXRpb24gc2F0aXNmaWVzIHRoZSBJQ0FPIHN0YW5kYXJkcy5cclxuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJEb2N1bWVudE51bWJlciBGb3JtYXQgVmFsaWRhdG9yIiwiZGVzY3JpcHRpb24iOiJUaGUgdmFsdWUgb2YgdGhlIERvY3VtZW50TnVtYmVyIGlzIHByZXNlbnRlZCBpbiB0aGUgZXhwZWN0ZWQgZm9ybWF0IGZvciB0aGlzIGRvY3VtZW50IHR5cGUuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJCaXJ0aERhdGUgQ3Jvc3MgUmVmZXJlbmNlIiwiZGVzY3JpcHRpb24iOiJUaGUgZXh0cmFjdGlvbiBlbmdpbmUgcmV0cmlldmVkIHRoZSB2YWx1ZXMgb2YgdGhlIEJpcnRoRGF0ZSBmcm9tIHRoZSBNUlogYW5kIHRoZSBWSVogYW5kIGZvdW5kIHRoZW0gdG8gYmUgbWF0Y2hpbmcuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJCaXJ0aCBEYXRlIEluIFJhbmdlIFZhbGlkYXRvciIsImRlc2NyaXB0aW9uIjoiVmVyaWZpZWQgdGhhdCB0aGUgZGF0ZSBvZiBiaXJ0aCBpcyBpbiB0aGUgZXhwZWN0ZWQgbG9naWNhbCByYW5nZSBmb3IgaG9sZGVycyBvZiB0aGlzIHR5cGUgb2YgZG9jdW1lbnRzIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJCaXJ0aERhdGUgRm9ybWF0IFZhbGlkYXRvciIsImRlc2NyaXB0aW9uIjoiVGhlIHZhbHVlIG9mIHRoZSBCaXJ0aERhdGUgaXMgcHJlc2VudGVkIGluIHRoZSBleHBlY3RlZCBmb3JtYXQgZm9yIHRoaXMgZG9jdW1lbnQgdHlwZS4iLCJyZXN1bHQiOjF9LHsibmFtZSI6IkV4cGlyeURhdGUgRm9ybWF0IFZhbGlkYXRvciIsImRlc2NyaXB0aW9uIjoiVGhlIHZhbHVlIG9mIHRoZSBFeHBpcnlEYXRlIGlzIHByZXNlbnRlZCBpbiB0aGUgZXhwZWN0ZWQgZm9ybWF0IGZvciB0aGlzIGRvY3VtZW50IHR5cGUuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJJc3N1ZURhdGUgRm9ybWF0IFZhbGlkYXRvciIsImRlc2NyaXB0aW9uIjoiVGhlIHZhbHVlIG9mIHRoZSBJc3N1ZURhdGUgaXMgcHJlc2VudGVkIGluIHRoZSBleHBlY3RlZCBmb3JtYXQgZm9yIHRoaXMgZG9jdW1lbnQgdHlwZS4iLCJyZXN1bHQiOjF9LHsibmFtZSI6IkZhY2UgU3Vic3RpdHV0aW9uIERldGVjdGlvbiBWYWxpZGF0b3IiLCJkZXNjcmlwdGlvbiI6IlRoZXJlIGFyZSBubyBzaWducyBvZiB0aGUgcG9ydHJhaXQgaW1hZ2UgYmVpbmcgc3dhcHBlZCBvciBhbHRlcmVkLiIsInJlc3VsdCI6MX0seyJuYW1lIjoiSXNzdWUgRGF0ZSAmIEV4cGlyeSBEYXRlIFZhbGlkYXRvciIsImRlc2NyaXB0aW9uIjoiVmVyaWZpZWQgdGhhdCB0aGUgZGF0ZSBvZiBpc3N1ZSBwcmVjZWRlcyB0aGUgZG9jdW1lbnTigJlzIGV4cGlyeSBkYXRlLiIsInJlc3VsdCI6MX0seyJuYW1lIjoiQmlydGggRGF0ZSAmIElzc3VlIERhdGUgVmFsaWRhdG9yIiwiZGVzY3JpcHRpb24iOiJWZXJpZmllZCB0aGF0IHRoZSBkYXRlIG9mIGJpcnRoIHByZWNlZGVzIHRoZSBkb2N1bWVudOKAmXMgaXNzdWUgZGF0ZS4iLCJyZXN1bHQiOjF9LHsibmFtZSI6IkJpcnRoIERhdGUgJiBFeHBpcnkgRGF0ZSBWYWxpZGF0b3IiLCJkZXNjcmlwdGlvbiI6IlZlcmlmaWVkIHRoYXQgdGhlIGRhdGUgb2YgYmlydGggcHJlY2VkZXMgdGhlIGRvY3VtZW504oCZcyBleHBpcnkgZGF0ZS4iLCJyZXN1bHQiOjF9LHsibmFtZSI6IkRvY3VtZW50TnVtYmVyIENoZWNrIERpZ2l0IFZhbGlkYXRvciIsImRlc2NyaXB0aW9uIjoiVmVyaWZpZWQgdGhhdCB0aGUgRG9jdW1lbnROdW1iZXIgaXMgY29ycmVjdC4iLCJyZXN1bHQiOjF9LHsibmFtZSI6Iklzc3VlIERhdGUgSW4gUGFzdCBWYWxpZGF0b3IiLCJkZXNjcmlwdGlvbiI6IlZlcmlmaWVkIHRoYXQgdGhlIGRhdGUgb2YgaXNzdWUgaXMgYmVmb3JlIHRoZSBjdXJyZW50IHN5c3RlbeKAmXMgZGF0ZSBhbmQgdGltZS4iLCJyZXN1bHQiOjF9LHsibmFtZSI6Ikxhc3ROYW1lIENyb3NzIFJlZmVyZW5jZSIsImRlc2NyaXB0aW9uIjoiVGhlIGV4dHJhY3Rpb24gZW5naW5lIHJldHJpZXZlZCB0aGUgdmFsdWVzIG9mIHRoZSBMYXN0TmFtZSBmcm9tIHRoZSBNUlogYW5kIHRoZSBWSVogYW5kIGZvdW5kIHRoZW0gdG8gYmUgbWF0Y2hpbmcuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJFeHBpcnlEYXRlIENyb3NzIFJlZmVyZW5jZSIsImRlc2NyaXB0aW9uIjoiVGhlIGV4dHJhY3Rpb24gZW5naW5lIHJldHJpZXZlZCB0aGUgdmFsdWVzIG9mIHRoZSBFeHBpcnlEYXRlIGZyb20gdGhlIE1SWiBhbmQgdGhlIFZJWiBhbmQgZm91bmQgdGhlbSB0byBiZSBtYXRjaGluZy4iLCJyZXN1bHQiOjF9LHsibmFtZSI6IkZpcnN0TmFtZSBDcm9zcyBSZWZlcmVuY2UiLCJkZXNjcmlwdGlvbiI6IlRoZSBleHRyYWN0aW9uIGVuZ2luZSByZXRyaWV2ZWQgdGhlIHZhbHVlcyBvZiB0aGUgRmlyc3ROYW1lIGZyb20gdGhlIE1SWiBhbmQgdGhlIFZJWiBhbmQgZm91bmQgdGhlbSB0byBiZSBtYXRjaGluZy4iLCJyZXN1bHQiOjF9LHsibmFtZSI6IkRvY3VtZW50TnVtYmVyIENyb3NzIFJlZmVyZW5jZSIsImRlc2NyaXB0aW9uIjoiVGhlIGV4dHJhY3Rpb24gZW5naW5lIHJldHJpZXZlZCB0aGUgdmFsdWVzIG9mIHRoZSBEb2N1bWVudE51bWJlciBmcm9tIHRoZSBNUlogYW5kIHRoZSBWSVogYW5kIGZvdW5kIHRoZW0gdG8gYmUgbWF0Y2hpbmcuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJEb2N1bWVudE51bWJlciBQcmVzZW5jZSBDaGVjayAiLCJkZXNjcmlwdGlvbiI6IlZlcmlmaWVkIHRoYXQgdGhlIERvY3VtZW50TnVtYmVyIGV4aXN0cyBpbiB0aGUgVklaLiIsInJlc3VsdCI6MX0seyJuYW1lIjoiQmlydGhQbGFjZSBQcmVzZW5jZSBDaGVjayAiLCJkZXNjcmlwdGlvbiI6IlZlcmlmaWVkIHRoYXQgdGhlIEJpcnRoUGxhY2UgZXhpc3RzIGluIHRoZSBWSVouIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJJQ0FPIFNpemUgQ2hlY2siLCJkZXNjcmlwdGlvbiI6Ik1SWiBkaW1lbnNpb25zIHNhdGlzZnkgdGhlIElTTyBzdGFuZGFyZHMgb2YgTVJaIGRpbWVuc2lvbnMuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJMYXN0TmFtZSBQcmVzZW5jZSBDaGVjayAiLCJkZXNjcmlwdGlvbiI6IlZlcmlmaWVkIHRoYXQgdGhlIExhc3ROYW1lIGV4aXN0cyBpbiB0aGUgVklaLiIsInJlc3VsdCI6MX0seyJuYW1lIjoiRmlyc3ROYW1lIFByZXNlbmNlIENoZWNrICIsImRlc2NyaXB0aW9uIjoiVmVyaWZpZWQgdGhhdCB0aGUgRmlyc3ROYW1lIGV4aXN0cyBpbiB0aGUgVklaLiIsInJlc3VsdCI6MX0seyJuYW1lIjoiQmlydGhEYXRlIFByZXNlbmNlIENoZWNrICIsImRlc2NyaXB0aW9uIjoiVmVyaWZpZWQgdGhhdCB0aGUgQmlydGhEYXRlIGV4aXN0cyBpbiB0aGUgVklaLiIsInJlc3VsdCI6MX0seyJuYW1lIjoiSXNzdWVEYXRlIFByZXNlbmNlIENoZWNrICIsImRlc2NyaXB0aW9uIjoiVmVyaWZpZWQgdGhhdCB0aGUgSXNzdWVEYXRlIGV4aXN0cyBpbiB0aGUgVklaLiIsInJlc3VsdCI6MX0seyJuYW1lIjoiQmlydGhEYXRlIENoZWNrIERpZ2l0IFZhbGlkYXRvciIsImRlc2NyaXB0aW9uIjoiVmVyaWZpZWQgdGhhdCB0aGUgQmlydGhEYXRlIGlzIGNvcnJlY3QuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJJc3N1aW5nQXV0aG9yaXR5IFByZXNlbmNlIENoZWNrICIsImRlc2NyaXB0aW9uIjoiVmVyaWZpZWQgdGhhdCB0aGUgSXNzdWluZ0F1dGhvcml0eSBleGlzdHMgaW4gdGhlIFZJWi4iLCJyZXN1bHQiOjF9LHsibmFtZSI6Ik1SWkNvbXBvc2l0ZUNoZWNrRGlnaXQgQ2hlY2sgRGlnaXQgVmFsaWRhdG9yIiwiZGVzY3JpcHRpb24iOiJWZXJpZmllZCB0aGF0IHRoZSBNUlpDb21wb3NpdGVDaGVja0RpZ2l0IGlzIGNvcnJlY3QuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJFeHBpcnlEYXRlIFByZXNlbmNlIENoZWNrICIsImRlc2NyaXB0aW9uIjoiVmVyaWZpZWQgdGhhdCB0aGUgRXhwaXJ5RGF0ZSBleGlzdHMgaW4gdGhlIFZJWi4iLCJyZXN1bHQiOjF9LHsibmFtZSI6IlByZXNlbmNlIEFnZ3JlZ2F0ZSBWYWxpZGF0b3IiLCJkZXNjcmlwdGlvbiI6IlN1Y2Nlc3M6IFdoZW4gYWxsIGZpZWxkcyB3aGljaCBhcmUgbWFya2VkIGFzIG1hbmRhdG9yeSBleGlzdCBvbiB0aGUgZG9jdW1lbnQuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJFeHBpcnlEYXRlIENoZWNrIERpZ2l0IFZhbGlkYXRvciIsImRlc2NyaXB0aW9uIjoiVmVyaWZpZWQgdGhhdCB0aGUgRXhwaXJ5RGF0ZSBpcyBjb3JyZWN0LiIsInJlc3VsdCI6MX0seyJuYW1lIjoiTVJaRnVsbCBMZW5ndGggVmFsaWRhdG9yIiwiZGVzY3JpcHRpb24iOiJJZiBNUlogbGluZSBsZW5ndGggbWF0Y2hlcyB2YWx1ZSBkZWZpbmVkIGJ5IElDQU8gc3RhbmRhcmQuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJDb2xvdXIgVmFsaWRhdG9yIiwiZGVzY3JpcHRpb24iOiJWYWxpZGF0aW9uIGNvbG91ciBvbiB0aGUgd2hpdGUgaW1hZ2UgZm9yIGVpdGhlciBjb2xvdXJlZCBvciBub3QuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJNUlogQ291bnRyeSBDb2RlIFZhbGlkYXRvciIsImRlc2NyaXB0aW9uIjoiTVJaIENvdW50cnkgQ29kZSBtYXRjaGVkIHdpdGggQ291bnRyeSBjb2RlIGluIERvY3VtZW50IEluZm9ybWF0aW9uICIsInJlc3VsdCI6MX0seyJuYW1lIjoiUG9ydHJhaXQgUGhvdG8gUHJlc2VuY2UgQ2hlY2sgVmFsaWRhdG9yIiwiZGVzY3JpcHRpb24iOiJTdWNjZXNzOiBJZiBwb3J0cmFpdCBwaG90byBpcyBsb2NhdGVkIGluIHRoZSBleHBlY3RlZCByZWdpb25cclxuIiwicmVzdWx0IjoxfSx7Im5hbWUiOiJSZWNhcHR1cmUgRGV0ZWN0aW9uIFZhbGlkYXRvciIsImRlc2NyaXB0aW9uIjoiVGhpcyBkb2N1bWVudCB3YXMgbm90IGNoZWNrZWQgZm9yIHNpZ25zIG9mIFJlY2FwdHVyZSIsInJlc3VsdCI6M31dfX0sInN1YiI6ImRpZDpldGhyOjB4ODFkNzg2YjM1ZjNlYTJmMzlhYTE3Y2IxOGQ5NzcyZTRlY2Q5NzIwNiIsIm5iZiI6MTY4MjYwMTE0OSwiaXNzIjoiZGlkOndlYjpleGFtcGxlLmNvbSJ9.T7dndv2rTaolcHO3pMnOggFntHYx7e-5SLJ5x_1EanaSorH7JLpiMX8v-VQeFpjDZLiwrpDuIBajoV0hXYhHrQ",
    },
  },
  identifier: "April 27, 2023 - UK SPECIMEN",
};

/*
 * Handle data from webhook
 * At the defined wehbook endpoint, each time an user shares data with you, data with format
 * {
 *   address: '0x0000000000000000000000000000000000000000',
 *   data: {
 *     ...
 *   }
 *  }
 */
const rulesValidation = async (req: NextApiRequest, res: NextApiResponse) => {
  const API_KEY = process.env.NEXT_PUBLIC_NEXERA_ID_API_KEY;

  const response = await fetch(
    "https://api-dev.nexera.id/compliance/rules/execute",
    {
      body: JSON.stringify({
        inputData: data, // data
        address: "0x82732eCa78474A772799b341100098F05464c401",
        policyId: `${POLICY_ID}`,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      method: "POST",
    }
  );

  const validationResult = await response.json();

  res.status(200).json(validationResult);
};

export default rulesValidation;

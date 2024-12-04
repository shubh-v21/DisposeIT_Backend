import connectDB from "../db/index.js";
import { Facility } from "../models/facility.model.js";
import facilities from "../data/facilities.js";
import facilityValidationSchema from "../validationSchema/facilityValidationSchema.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

connectDB()
	.then(async () => {
		console.log("Connected to MongoDB!");

		try {
			for (const facility of facilities) {
				// Validate facility
				const { error } = facilityValidationSchema.validate(facility);
				if (error) {
					console.error(`Validation failed for facility: ${facility.facilityName}. Error: ${error.details[0].message}`);
					continue; // Skip this facility and move to the next
				}

				try {
					// Attempt to insert the facility
					await Facility.create(facility);
					console.log(`Facility imported successfully: ${facility.facilityName}`);
				} catch (dbError) {
					console.error(`Error importing facility: ${facility.facilityName}`, dbError);
				}
			}

			console.log("Import process completed.");
			process.exit(0); // Exit the process
		} catch (error) {
			console.error("Error during facility import:", error);
			process.exit(1);
		}
	})
	.catch((err) => {
		console.error("MONGODB connection Failed!", err);
		process.exit(1);
	});

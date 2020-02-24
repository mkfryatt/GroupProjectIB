package cost;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import data.Location;
import data.Timeframe;
import javafx.util.Pair;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.Base64;

public class Cost {
    public static Location unepCambridgeLocation = new Location(0, "UNEP Cambridge Office", 0.091957, 52.21987);

    public static Double calculateFlightEmissions(Location source, Location destination) {

        String stringURL = "https://api.carbonkit.net/3.6/categories/Great_Circle_flight_methodology/calculation?type" +
                "=great+circle+route&" + "values.lat1=" + ((Double) source.getLat()).toString() + "&values.long1=" + ((Double) (source.getLon())).toString() +
                "&values.lat2=" + ((Double) (destination.getLat())).toString() + "&values.long2=" + ((Double) (destination.getLon())).toString();

        URL url;
        String connectionResult = null;
        try {
            url = new URL(stringURL);
            URLConnection uc = url.openConnection();
            String username = "Oberon_99";
            String password = "CarbonKit123!";
            String userpass = username + ":" + password;
            String basicAuth = "Basic " + (Base64.getEncoder().encodeToString(userpass.getBytes()));
            uc.setRequestProperty("Authorization", basicAuth);
            uc.setRequestProperty("Content-Type", "application/json; charset=utf8");
            uc.setRequestProperty("Accept", "application/json");

            BufferedReader reader = new BufferedReader(new InputStreamReader(uc.getInputStream()));
            StringBuilder builder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
                builder.append(System.getProperty("line.separator"));
            }
            connectionResult = builder.toString();

        } catch (IOException e) {
            e.printStackTrace();
        }

        double totalDirectEmissions = 0.0;
        JsonObject convertedObject = new Gson().fromJson(connectionResult, JsonObject.class);
        JsonObject output = convertedObject.getAsJsonObject("output");
        JsonArray amounts = output.getAsJsonArray("amounts");
        for (JsonElement amount : amounts) {
            JsonObject am = amount.getAsJsonObject();
            String type = (am.get("type")).getAsString();
            if (type.equals("totalDirectCO2e")) {
                totalDirectEmissions = (am.get("value").getAsDouble());
            }
        }
        return totalDirectEmissions;
    }

    public static boolean checkTimeframeOverlap(Timeframe a, Timeframe b) {
        // check if there is any overlap in the timeframes of Events A

//        boolean bIna = ((a.getStartTime() <= b.getStartTime()) && (a.getEndTime() >= b.getEndTime()));
//        boolean aInb = ((b.getStartTime() <= a.getStartTime()) && (b.getEndTime() >= a.getEndTime()));
//        boolean bLefta = (b.getStartTime() < a.getStartTime()) && (b.getEndTime() < a.getEndTime());
//        boolean bRighta = (a.getStartTime() < b.getStartTime()) && (a.getEndTime() < b.getEndTime());
//        return (bLefta || bRighta || bIna || aInb);

        return (a.getStartTime() < b.getEndTime() && b.getStartTime() < a.getEndTime());

    }

    public static boolean checkTimeframeBefore(Timeframe a, Timeframe b) {
        // return true if Event a happened before Event b
        return ((a.getStartTime() < b.getStartTime()) && (a.getEndTime() < b.getEndTime()));
    }

    public static int calculateTimeDiff(Timeframe a, Timeframe b) {
        if (checkTimeframeOverlap(a, b)) {
            return 0;
        } else if (checkTimeframeBefore(a, b)) {
            return (b.getStartTime() - a.getEndTime());
        } else {
            return (a.getStartTime() - b.getEndTime());
        }
    }


    public static Double calculateCost(int timeDiff, Location wish, Location trip) {

        Double TimeDiffScore = 0.0;
        Double FlightEmissionScore = 0.0;

        Double emissionsCamToWish = calculateFlightEmissions(unepCambridgeLocation, wish);
        Double emissionTripToWish = calculateFlightEmissions(trip, wish);

        if (emissionTripToWish > emissionsCamToWish) {
            // indicates that flying from Cambridge is better than flying from this match location.
            return 0.0;
        } else {
            // TODO DECIDE ON FUNCTION FOR THIS
            FlightEmissionScore += (-0.0002 * emissionTripToWish) + 1;
        }

        if (timeDiff < 3) {
            TimeDiffScore += 1.0 - (timeDiff / 60.0);
        } else {
            TimeDiffScore += 57.0 / (timeDiff + 57.0);
        }
        return (0.5 * TimeDiffScore) + (0.5 * FlightEmissionScore);

    }

    public static void main(String[] args) {
        System.out.println("works");
    }
}



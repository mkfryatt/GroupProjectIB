package main.java.cost;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import main.java.data.Location;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.Base64;

public class Cost {

    // calculate cost using actual emissions
    public static Double calculateCost(int timeDiff, Location wish, Location trip) {
        return calculateCost(timeDiff, calculateFlightEmissions(trip, wish));
    }

    public static Double calculateFlightEmissions(Location source, Location destination) {

        String stringURL = "https://api.carbonkit.net/3.6/categories/Great_Circle_flight_methodology/calculation?type" +
                "=great+circle+route&" + "values.lat1=" + ((Double) source.getLat()).toString() + "&values.long1=" + ((Double) (source.getLon())).toString() +
                "&values.lat2=" + ((Double) (destination.getLat())).toString() + "&values.long2=" + ((Double) (destination.getLon())).toString();

        URL url;
        String connectionResult = null;
        try {
            url = new URL(stringURL);
            URLConnection uc = url.openConnection();
            // TODO: remove personal username and password when giving to client
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

    public static Double calculateCost(int timeDiff, double emission) {

        double days = (double) timeDiff / 86400;
        return -costFunction9(days, emission);
    }

    public static double costFunction9(double days, double emission) {
        final double a = 8, b = 9, c = 300, d = 25;
        return emission - a * Math.sin((b + c) / (days + c)) * Math.exp(-days / d);
    }

    // ----------------------------------------------------------------------
    // calculate cost using estimated emissions
    public static double calculateDistance(Location start, Location end) {
        // returns distance between 2 lat and long points in km
        double startLat = start.getLat();
        double startLong = start.getLon();
        double endLat = end.getLat();
        double endLong = end.getLon();
        if ((startLat == endLat) && (startLong == endLong)) {
            return 0;
        } else {
            double theta = startLong - endLong;
            double dist =
                    Math.sin(Math.toRadians(startLat)) * Math.sin(Math.toRadians(endLat)) + Math.cos(Math.toRadians(startLat)) * Math.cos(Math.toRadians(endLat)) * Math.cos(Math.toRadians(theta));
            dist = Math.acos(dist);
            dist = Math.toDegrees(dist);
            dist = dist * 60 * 1.1515;
            dist *= 1.609344;
            return dist;
        }
    }

    public static double calculateEstimatedCost(int timeDiff, Location wish, Location trip) {
        double days = (double) timeDiff / 86400;
        double estimatedEmissions = calculateEmissionsByDistance(wish, trip);
        final double a = 8, b = 9, c = 300, d = 25;
        return -(estimatedEmissions - a * Math.sin((b + c) / (days + c)) * Math.exp(-days / d));

    }

    public static double calculateEmissionsByDistance(Location start, Location end) {
        double distance = calculateDistance(start, end);
        return distance * 0.118;

    }

    public static void main(String[] args) {
        System.out.println("works");
    }
}



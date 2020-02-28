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


    public static Double calculateCost(int timeDiff, Location wish, Location trip) {
        return calculateCost(timeDiff, calculateFlightEmissions(trip, wish));
    }

    public static Double calculateCost(int timeDiff, double emission) {

        double days = (double) timeDiff / 86400;
        return -costFunction9(days, emission);
    }

    public static double costFunction9(double days, double emission) {
        final double a = 8, b = 9, c = 300, d = 25;
        return emission - a * Math.sin((b + c) / (days + c)) * Math.exp(-days / d);
    }

    //    public static double costFunction7(double days, double emission) {
//        return Math.log(emission + 100.0) + 0.05 * days * days;
//    }
//
//    public static double costFunction8(double days, double emission) {
//        final double a = 8, b = 9, c = 300;
//        return emission - a * Math.sin((b + c) / (days + c));
//    }

    public static void main(String[] args) {
        System.out.println("works");
    }
}



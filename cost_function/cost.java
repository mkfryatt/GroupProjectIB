import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.Base64;


public class cost {
    public static Double unepLat = 52.21987;
    public static Double unepLong = 0.091957;

    public static String connectToCarbonKit(Double lat1, Double long1, Double lat2, Double long2) {

        String stringURL = "https://api.carbonkit.net/3.6/categories/Great_Circle_flight_methodology/calculation?type" +
                "=great+circle+route&" + "values.lat1=" + lat1.toString() + "&values.long1=" + long1.toString() +
                "&values.lat2=" + lat2.toString() + "&values.long2=" + long2.toString();

        URL url;
        String result = null;
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
            result = builder.toString();

        } catch(IOException e) {
            e.printStackTrace();
        }

        return result;
    }

    public static Double flightEmissionFromString(String jsonString) {
        // Defualt to using totalDirectCO2e as metric
        Double totalDirectEmissions = 0.0;
        JsonObject convertedObject = new Gson().fromJson(jsonString, JsonObject.class);
        JsonObject output = convertedObject.getAsJsonObject("output");
        JsonArray amounts = output.getAsJsonArray("amounts");
        for(JsonElement amount : amounts) {
            JsonObject am = amount.getAsJsonObject();
            String type = (am.get("type")).getAsString();
            if(type.equals("totalDirectCO2e")) {
                totalDirectEmissions = (am.get("value").getAsDouble());
            }
        }
        return totalDirectEmissions;
    }

    public static Double flightEmissionFromString(String jsonString, String metric) {
        // Metric passed in
        Double flightEmission = 0.0;
        JsonObject convertedObject = new Gson().fromJson(jsonString, JsonObject.class);
        JsonObject output = convertedObject.getAsJsonObject("output");
        JsonArray amounts = output.getAsJsonArray("amounts");
        for(JsonElement amount : amounts) {
            JsonObject am = amount.getAsJsonObject();
            String type = (am.get("type")).getAsString();
            if(type.equals(metric)) {
                flightEmission = (am.get("value").getAsDouble());
            }
        }
        return flightEmission;
    }

    public static Double FlightEmissionFromLocation(Double lat1, Double long1, Double lat2, Double long2) {
        String carbonKitJsonString = connectToCarbonKit(lat1, long1, lat2, long2);
        return flightEmissionFromString(carbonKitJsonString);
    }

    public static Double FlightEmissionFromLocation(Double lat1, Double long1, Double lat2, Double long2,
                                                    String metric) {
        String carbonKitJsonString = connectToCarbonKit(lat1, long1, lat2, long2);
        return flightEmissionFromString(carbonKitJsonString, metric);
    }


    public static Double cost(Double wishLat, Double wishLong, Double matchLat, Double matchLong, Double time_diff) {
        Double TimeWeighting = 0.0;
        Double FlightWeighting = 0.0;

        Double emissionsCamToWish = FlightEmissionFromLocation(unepLat, unepLong, wishLat, wishLong);
        Double emissionMatchToWish = FlightEmissionFromLocation(matchLat, matchLong, wishLat, wishLong);

        if (emissionMatchToWish > emissionsCamToWish) {
            // indicates that flying from Cambridge is better than flying from this match location.
            return 0.0;
        } else {
            // TODO DECIDE ON FUNCTION FOR THIS
            FlightWeighting += (-0.0002 * emissionMatchToWish) + 1;
        }

        if (time_diff < 3) {
            TimeWeighting += 1 - (time_diff / 60);
        } else {
            TimeWeighting += 57 / (time_diff + 57);
        }
        return (0.5 * TimeWeighting) + (0.5 * FlightWeighting);

    }

    public static void main(String[] args) {
        Double nairobiLat = -1.2426;
        Double nairobiLong = 36.915862;
        Double kampalaLat = 0.252013;
        Double kampalaLong = 32.55938;
        Double capeLat = -33.970726;
        Double capeLong = 18.601905;
        Double chengduLat = 30.438732;
        Double chengduLong = 104.140169;
        Double romeLat = 42.11;
        Double romeLong = 13.741516;
        Double nyLat = 40.7128;
        Double nyLong = 74.0060;
        Double sydneyLat = 33.8688;
        Double sydneyLong = 151.2093;

        Double weightingKampala = cost(nairobiLat, nairobiLong, kampalaLat, kampalaLong, 1.0);
        Double weightingCape = cost(nairobiLat, nairobiLong, capeLat, capeLong, 5.0);
        Double weightingChengdu = cost(nairobiLat, nairobiLong, chengduLat, chengduLong, 10.0);
        Double weightingRome = cost(nairobiLat, nairobiLong, romeLat, romeLong, 3.0);


        System.out.println("Kampala: " + weightingKampala);
        System.out.println("Cape Town: " + weightingCape);
        System.out.println("Chengdu: " + weightingChengdu);
        System.out.println("Rome: " + weightingRome);

    }
}



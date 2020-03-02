package test.java;

import main.java.data.*;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.*;

import static main.java.cost.Cost.*;

public class CostTests {
    public static Location nairobi = new Location(0, "nairobi", 36.8219, 1.2921);
    public static Location capeTown = new Location(0, "cape town", 18.42141, 33.9249);
    public static Location kampala = new Location(0, "kampala", 32.5825, 0.3476);
    public static Location rome = new Location(0, "rome", 12.4964, 41.9028);
    public static Location shanghai = new Location(0, "shanghai", 121.4737, 31.2304);
    public static Location wuxi = new Location(0,"wuxi",120.3119,31.4912);
    public static Location tokyo = new Location(0, "tokyo", 139.6503, 35.6762);
    public static Location london = new Location(0, "london",  0.1278, 51.5074);
    public static Location milan = new Location(0, "milan", 9.1900, 45.4642);

    public static ArrayList<Location> destinationList = new ArrayList<Location>(Arrays.asList(capeTown, kampala, rome,
            shanghai, wuxi, tokyo, london, milan));



    @Test
    public static void testHowTimeDifferenceAffectsRankings() {
        Double capeTown3DayTimeDiffRanking = calculateCost(3, nairobi, capeTown);
        Double capeTown10DayTimeDiffRanking = calculateCost(10, nairobi, capeTown);
        Double capeTown60DayTimeDiffRanking = calculateCost(60, nairobi, capeTown);

        Assertions.assertTrue((capeTown3DayTimeDiffRanking > capeTown10DayTimeDiffRanking), "Show that rating for 3 " +
                "day time difference is greater than the rating for 10 day time difference");

        Assertions.assertTrue((capeTown10DayTimeDiffRanking > capeTown60DayTimeDiffRanking), "Show that rating for 10" +
                " day time difference is greater than the rating for 60 day time difference");

        Double rankingDiff3And10 = capeTown3DayTimeDiffRanking - capeTown10DayTimeDiffRanking;
        Double rankDiff10And60 = capeTown10DayTimeDiffRanking - capeTown60DayTimeDiffRanking;

        Assertions.assertTrue(rankDiff10And60 > rankingDiff3And10,
                "Show that there is a greater difference in rating between 10 and 60 days, versus 3 and 10 days");

    }

    @Test
    public static void testHowFlightEmissionsAffectsRankings() {
        Double capeTownRanking = calculateCost(3, nairobi, capeTown);
        Double kampalaRanking = calculateCost(3, nairobi, kampala);
        Double romeRanking = calculateCost(3, nairobi, rome);

        Assertions.assertTrue(kampalaRanking > capeTownRanking, "Show that Kamapala has a better ranking than Cape " +
                "Town to fulfil a Nairobi Wish");

        Assertions.assertTrue(kampalaRanking > capeTownRanking, "Show that Kamapala has a better ranking than Cape " +
                "Town to fulfil a Nairobi Wish");

        Assertions.assertTrue(romeRanking < kampalaRanking, "Show that Kampala has a better ranking than Rome to " +
                "fulfil a Nairobi wish");

    }

    @Test
    public static void testHowFlightAndTimeDiffAffectRankings() {
        Double kampala30Ranking = calculateCost(30*86400, nairobi, kampala);
        Double capeTown10Ranking = calculateCost(10*86400, nairobi, capeTown);
        Double rome5Ranking = calculateCost(5*86400, nairobi, rome);

        Assertions.assertTrue(capeTown10Ranking > kampala30Ranking, "Show that to fulfil a wish in Nairobi, timeDiff " +
                "of 30 days in Kampala is ranked lower than 10 days in Cape Town");

        Assertions.assertTrue(rome5Ranking > capeTown10Ranking, "Show that to fulfil a wish in Nairobi, flying from " +
                "Rome with timeDiff of 5 is ranked higher than flying from Cape Town with time diff of 10 days");

    }

    @Test
    public static void testHowManyDaysAreAcceptable(){
        Location target = rome;
        Location start = london;
        Location startAlt = milan;

        double emission = calculateFlightEmissions(start,target);
        int time = 86400 * 0;
        double score = calculateCost(time,emission);

        double emissionAlt = calculateFlightEmissions(startAlt,target);
        int timeAlt=0;
        double scoreAlt;
        {
            long l = 0,r=Integer.MAX_VALUE;
            while(l<r-5){
                timeAlt = (int)((((long)l)+r)/2);
                scoreAlt = calculateCost(timeAlt,emissionAlt);
                if(scoreAlt<score)r=timeAlt; else l=timeAlt;
            }
        }
        System.out.println("Flying from "+start.name+" to "+target.name+" wasting "+(time/86400)+" days is ranked similarly to flying from "+startAlt.name+" to "+target.name+" wasting "+(timeAlt/86400)+"days");
    }

    public static void printScore(int days, Location start, Location end) {
        int timeAlt = 86400 * days;
        double emissions = calculateFlightEmissions(start, end);
        double score = calculateCost(timeAlt, emissions);
        System.out.println(start.getName() + " to " + end.getName() + " and " + days + " days wasted: " + score);
    }

    public static void checkDistanceEmissionCalculationsAreRoughlySame() {
        for(Location location : destinationList) {
            double actualEmission = calculateFlightEmissions(location, nairobi);
            double estimatedEmission = emissionsByDistance(location, nairobi);
            System.out.println("Actual vs Estimated: " + actualEmission + " vs " + estimatedEmission);
        }

    }



    public static void checkDistanceAndEmissionRankingsAreSame(int timeDiff){
        HashMap<Double, String> emissionScores = new HashMap<>();
        HashMap<Double, String> distanceScores = new HashMap<>();
        for(Location location : destinationList) {
            double  emissionScore = calculateCost(timeDiff, nairobi, location);
            double distanceScore = calculateEstimatedCost(timeDiff, nairobi, location);
            emissionScores.put(emissionScore, location.getName());
            distanceScores.put(distanceScore, location.getName());
        }

        TreeMap<Double, String> emissionSorted = new TreeMap<>(emissionScores);
        TreeMap<Double, String> distanceSorted = new TreeMap<>(distanceScores);

//        assert(emissionSorted.values() == distanceSorted.values());

        for(Map.Entry<Double, String> emissionEntry : emissionSorted.entrySet()) {
            System.out.println(emissionEntry.getValue() + ": " + emissionEntry.getKey());
        }

        System.out.println("------------");

        for(Map.Entry<Double, String> distanceEntry : distanceSorted.entrySet()) {
            System.out.println(distanceEntry.getValue() + ": " + distanceEntry.getKey());
        }

    }

    public static void main(String[] args) {
//        testHowTimeDifferenceAffectsRankings();
//        testHowFlightEmissionsAffectsRankings();
//        testHowFlightAndTimeDiffAffectRankings();
        checkDistanceAndEmissionRankingsAreSame(3);
//        checkDistanceEmissionCalculationsAreRoughlySame();
    }



}

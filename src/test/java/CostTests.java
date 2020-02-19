import data.Location;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import static cost.Cost.calculateCost;

public class CostTests {
    public static Location nairobiWish = new Location(0, "nairobi", 36.8219, 1.2921);
    public static Location capeTown = new Location(0, "cape town", 18.42141, 33.9249);
    public static Location kampala = new Location(0, "kampala", 32.5825, 0.3476);
    public static Location rome = new Location(0, "rome", 12.4964, 41.9028);
    public static Location shanghai = new Location(0, "shanghai", 121.4737, 31.2304);

    @Test
    public static void testHowTimeDifferenceAffectsRankings() {
        Double capeTown3DayTimeDiffRanking = calculateCost(3, nairobiWish, capeTown);
        Double capeTown10DayTimeDiffRanking = calculateCost(10, nairobiWish, capeTown);
        Double capeTown60DayTimeDiffRanking = calculateCost(60, nairobiWish, capeTown);

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
        Double capeTownRanking = calculateCost(3, nairobiWish, capeTown);
        Double kampalaRanking = calculateCost(3, nairobiWish, kampala);
        Double romeRanking = calculateCost(3, nairobiWish, rome);
        Double shanghaiRanking = calculateCost(3, nairobiWish, shanghai);

        Assertions.assertTrue(kampalaRanking > capeTownRanking, "Show that Kamapala has a better ranking than Cape " +
                "Town to fulfil a Nairobi Wish");

        Assertions.assertEquals(0.0, shanghaiRanking, "Show that Shanghai is not considered a match, as flying from " +
                "Cambridge would be better than flying from Shanghai");

        Assertions.assertTrue(kampalaRanking > capeTownRanking, "Show that Kamapala has a better ranking than Cape " +
                "Town to fulfil a Nairobi Wish");

        Assertions.assertTrue(romeRanking < kampalaRanking, "Show that Kampala has a better ranking than Rome to " +
                "fulfil a Nairobi wish");

    }

    @Test
    public static void testHowFlightAndTimeDiffAffectRankings() {
        Double kampala30Ranking = calculateCost(30, nairobiWish, kampala);
        Double capeTown10Ranking = calculateCost(10, nairobiWish, capeTown);
        Double rome5Ranking = calculateCost(5, nairobiWish, rome);

        Assertions.assertTrue(capeTown10Ranking > kampala30Ranking, "Show that to fulfil a wish in Nairobi, timeDiff " +
                "of 30 days in Kampala is ranked lower than 10 days in Cape Town");

        Assertions.assertTrue(rome5Ranking > capeTown10Ranking, "Show that to fulfil a wish in Nairobi, flying from " +
                "Rome with timeDiff of 5 is ranked higher than flying from Cape Town with time diff of 10 days");

    }

    public static void main(String[] args) {
        testHowTimeDifferenceAffectsRankings();
        testHowFlightEmissionsAffectsRankings();
        testHowFlightAndTimeDiffAffectRankings();
    }



}

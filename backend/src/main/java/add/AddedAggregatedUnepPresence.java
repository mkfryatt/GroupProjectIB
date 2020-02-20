package main.java.add;

public class AddedAggregatedUnepPresence {
    public static void add(String table, int key) {
        //TODO: query for all wishes
        //For each wish:
            //does it have any Organization Constraints?
                // No, it doesn't
                    // It HAS to be one (and only one) location constraints.
                    // Consider cost of the union of the time constraints of the wish and the timeframe (possibly infinte) of the newly added uneppresence. use this to generate 1 suggestion.
                // Yes it does
                    // query in AggregatedOrgPresences where org is one of the OrgConstraints associated with the wish, and also filter for a possible location constraints (if no location constraints, don't filter by location)
                        // For each OrgPresence, consider the intersection between timeframe of that OrgPresence and the union of the wish timefrmaes; for each interval generate 1 suggestion.
    }
}

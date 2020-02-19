package main.java.add;

public class Add(){
    public static void add(String table,int key) {
        switch(table) {
            case "UNEP HQ":
            case "UNEP Trip":
                AddAggregatedUnepPresence.add();
                break;
            case "OrgPresence":
                AddAggregatedOrgPresence.add();
                break;
            case ""

        }
    }

}
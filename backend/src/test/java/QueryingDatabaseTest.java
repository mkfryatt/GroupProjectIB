package test.java;

import database.DatabaseConnector;
import main.java.add.Add;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;


import javax.xml.crypto.Data;
import java.sql.ResultSet;
import java.sql.SQLException;

public class QueryingDatabaseTest {


    @Test
    public static void queryUnepReps() throws SQLException {
        int repNumber = 0;
        ResultSet rsUnepReps = Add.dbCon.executeQuery("SELECT * FROM unep_reps");
        while(rsUnepReps.next()) {
            repNumber += 1;
        }
        System.out.println(repNumber);
        Assertions.assertEquals(repNumber, 5);
    }

    public static void addUnepPresence() {
        // check number of aggr_unep_presences
        // add unep presence
        // check number of aggr_unep_presences after and see if it increased

    }



    public static void main(String[] args) throws SQLException {
        System.out.println("hello");
        queryUnepReps();
    }
}

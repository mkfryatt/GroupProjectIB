import database.DatabaseConnector;
import main.java.add.Add;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DatabaseQuery {
    public static int countEntriesInTable(String table) {
        int entries = 0;
        ResultSet rs = Add.dbCon.executeQuery("SELECT * FROM " + table);
        try {
            while(rs.next()) {
                entries += 1;
            }
        } catch(SQLException e) {
            e.printStackTrace();
        }
        return entries;
    }

    public static int insertUnepRep(String firstName, String lastName, String email) {
        int unepRepDifferent = 0;
        try {
            int numberUnepRepsBefore = countEntriesInTable("unep_reps");
            String sql = "INSERT INTO unep_reps(firstName, lastName, email) VALUES(?,?,?)";
            Connection conn = Add.dbCon.getConn();
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, firstName);
            pstmt.setString(2, lastName);
            pstmt.setString(3, email);
            pstmt.executeUpdate();
            int numerUnepRepsAfter = countEntriesInTable("unep_reps");
            unepRepDifferent = numerUnepRepsAfter - numberUnepRepsBefore;
        } catch(SQLException e) {
            e.printStackTrace();
        }

        return unepRepDifferent;
    }

    public static int insertUnepHQ(String name, int loc_id) {
        int entryDiff = 0;
        try {
            int entriesBefore = countEntriesInTable("unep_presences");
            String sql = "INSERT INTO unep_presences(name, loc_id, startTime, endTime) VALUES(?,?,?,?)";
            Connection conn = Add.dbCon.getConn();
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, name);
            pstmt.setInt(2, loc_id);
            pstmt.setInt(3, 0);
            pstmt.setInt(4, 1000000000);
            pstmt.executeUpdate();
            int entriesAfter = countEntriesInTable("unep_presences");
            entryDiff = entriesAfter - entriesBefore;
        } catch(SQLException e) {
            e.printStackTrace();
        }
        return entryDiff;
    }

    public static void updatedSuggestions(String table, int key) throws SQLException{
        Add.add(table, key);
    }


    public static void main(String[] args) throws SQLException {
        updatedSuggestions("wishes", 3);
    }
}

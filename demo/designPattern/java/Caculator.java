import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Scanner;

import redis.clients.jedis.Jedis;

public class Caculator
{
	public static void main(String[] args) {
		try
		{
			System.out.println("please input the number A");
			Scanner scanner = new Scanner(System.in);
			String numberA = scanner.nextLine();
			System.out.println("please input the operator");
			String operator = scanner.nextLine();
			System.out.println("please input the numberB");
			String numberB = scanner.nextLine();
			String result = "";
			try {
				System.in.close();
				scanner.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			result = new Double(Operator.GetResult(Double.parseDouble(numberA),Double.parseDouble(numberB),operator)).toString();

			System.out.println(result);
		}
		catch(Exception ex)
		{
			System.out.println("error");
		}
	}
}
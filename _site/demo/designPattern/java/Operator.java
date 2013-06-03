import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Scanner;

import redis.clients.jedis.Jedis;

public class Operator{
	public static double GetResult(double numberA,double numberB,String operate)
	{
		double result = 0d;
		switch (operate)
		{
			case "+":
			result = numberA+numberB;
			break;
			case "-":
			result = numberA-numberB;
			break;
			case "*":
			result = numberA*numberB;
			break;
			case "/":
			result = numberA/numberB;
			break;
		}
		return result;
	};
	private double hexi;
	public double	getHexi(){
		return this.hexi;
	};
	public setHexi(double hexi){
		this.hexi=hexi;
	};
}
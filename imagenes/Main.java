package package1;

import java.util.Scanner;
public class Main {
    
    public static void main (String [] args){
   
        Scanner entrada = new Scanner(System.in);
        String numero1 = entrada.nextLine();
        int n = Integer.parseInt(numero1);
        String nombres = entrada.nextLine();
        String Pila1 [] = new String [n];
        Pila1 = nombres.split(" ");
        nombres = "";
        
        String numero2 = entrada.nextLine();
        int m = Integer.parseInt(numero2);
        String Pila2 [] = new String [m];
        nombres = entrada.nextLine();
        Pila2 = nombres.split(" ");
        String [] Pila3 = new String[n+m];
        
        for(int i =0; i<Pila1.length; i++){
        Pila3[i] = Pila1[i];
            
        }
        
        int buscador = Pila1.length;
        int contador = 0;

        
        for(int i =0; i < n; i++){
             for(int j =0; j < m; j++){
             if(Pila2[j].equals(Pila1[i])){
             contador++;
                 
             }
             Pila3[buscador] = Pila2[j];
             Pila2[j] = String.valueOf(contador);
             contador = 0;
                 
        }
        
    }
        
       for(int i =0; i<Pila3.length; i++){
           System.out.println(Pila3[i]);
            
        }
       
        for(int i =0; i<Pila2.length; i++){
            System.out.println(Pila2[i]);
            
        }
    
}
}

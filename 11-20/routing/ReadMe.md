# Webshop Adatbázis

## Vásárló (Customers)

Tulajdonságok: Vásárló_ID, Név, Email, Cím, Regisztráció_Dátuma

## Termék (Products)

Tulajdonságok: Termék_ID, Név, Leírás, Ár, Készlet

## Entitás: Rendelés (Orders)

        Ez a fő entitás, amely rögzíti, hogy melyik vásárló mikor adott le rendelést.

        Tulajdonságok: Rendelés_ID, Vásárló_ID, Rendelés_Dátuma, Szállítási_Cím, Státusz

## Rendelési Tételek (Order_Items)

        Ez az entitás kapcsolja össze a "Rendelés" és a "Termék" entitásokat. Egy rendelésben több termék is lehet, és egy termék több rendelésben is szerepelhet.

        Tulajdonságok: Tétel_ID, Rendelés_ID, Termék_ID, Mennyiség, Egységár

## Kategória (Categories)

        Tulajdonságok: Kategória_ID, Kategória_Név, Szülő_Kategória_ID (önmagára hivatkozás a hierarchia kezelésére)
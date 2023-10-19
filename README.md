## Tehtävässä olleista haasteista ja ratkaisuista

Haaste:
Backendin supertestillä tehdyt api testit eivät aiheuttaneet jobin epäonnistumista, vaikka testit epäonnistuivat. Siten deployment workflow meni läpi, vaikka api testit epäonnistuivat.

Ratkaisu:
Selvitin asiaa ensin googlaamalla ja löysin muutaman henkilön ajautuneen samankaltaiseen ongelmaan. Valmista ratkaisua asiaan ei löytynyt. Ratkaisin asian seuraavasti: workflowssa tallennan api test stepin konsolin tulosteen tekstitiedostoon ja seuraavissa stepeissä luen tiedoston sisällön ja aiheutan errorin ehdollisesti, mikäli tekstistä löytyy merkkijono FAIL. Tiedän, että ratkaisu on ehkä hieman "hacky", mutta se on kuitenkin ratkaisu toistaiseksi, kun parempaa ei löytynyt.

Haaste: fly io deployment epäonnistui, koska fly io:n koneessa oli liian vähän RAM muistia.

Ratkaisu:
Blogilista appi ja sen buildaaminen vaati enemmän RAMia, kuin tehtävissä aiemmin käytetty pokedex appi. Tutkin hieman asiaa ja havaitsin, että fly io:ssa ilmainen taso sisältää oletuksena maksimissaan 256mb RAMia. Fly io deployment vaiheessa huomasin errorin, jossa luki "out of memory" muun ohella. Esimerkiksi Renderin ilmainen taso näyttäisi sisältävän noin 500mb RAMIa, joten samaa ongelmaa tuskin tulee Renderin käyttäjille. Ratkaisin asian skaalaamalla fly io:ssa käytettävää konetta sisältämään noin 500mb RAMia.

Haaste: kaksi eslintrc tiedostoa aiheuttivat ongelmia fly io:ssa tapahtuvassa määrittelemässäni release_command eli build vaiheessa.

Ratkaisu:
Perinteiseen tapaan googlaamalla löytyi kohtalontovereita, jotka olivat ajautuneet samankaltaiseen ongelmaan (ei kuitenkaan täysin samaan). Ratkaisin asian pääosin poistamalla frontista eslintrc tiedoston.

Muitakin haasteita tuli vastaan, mutta nämä varmaan oleellisimmat. 

Hyvä ja opettavainen tehtävä, koska joutui oma-aloitteisesti ratkaisemaan asioita, joita ei ollut tehtävämateriaalissa ja niihin ei löytynyt suoraan vastauksia googlesta.

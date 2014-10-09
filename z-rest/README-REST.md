# z-rest

Every request requires a basic auth.

Assuming that the remote server is located at http://192.168.50.11:5000/.

## Receive a list of folders

    curl "http://192.168.50.11:5000/folders" --user demo1:test
    {
      "folders": [
        {
          "count": 0,
          "id": "000000004643FC50C0F14E8E855510C59A14928201000000030000009B049B9703BF46CC9FA0EE078DE6666200000000",
          "name": "Suggested Contacts"
        },
        {
          "count": 0,
          "id": "000000004643FC50C0F14E8E855510C59A14928201000000030000000E397E94DF4E430DA5933BAD7C8B5BF100000000",
          "name": "Quick Step Settings"
        },
        {
          "count": 7,
          "id": "000000004643FC50C0F14E8E855510C59A1492820100000003000000C6F47BCD36E243C89B35612CBE71441100000000",
          "name": "Sent Items"
        },
        ...
        {
          "count": 8,
          "id": "000000004643FC50C0F14E8E855510C59A14928201000000030000001C90561ACCFB43B29087BD2F2ABAD1BF00000000",
          "name": "Inbox"
        }
      ]
    }

## Receive a list of items of the Inbox

    $ curl "http://192.168.50.11:5000/folders/000000004643FC50C0F14E8E855510C59A14928201000000030000001C90561ACCFB43B29087BD2F2ABAD1BF00000000" --user demo1:test
    {
      "items": [
        {
          "id": "000000004643FC50C0F14E8E855510C59A1492820100000005000000A8B951CC37074548AC41B1DC1CA0888300000000",
          "subject": "Undelivered Mail Returned to Sender"
        },
        {
          "id": "000000004643FC50C0F14E8E855510C59A14928201000000050000004EBB844041384C70807FEF587E9B73F600000000",
          "subject": "plaintext"
        },
        {
          "id": "000000004643FC50C0F14E8E855510C59A1492820100000005000000C93D7B2CD9C04E30B6FB3748DAE0C17000000000",
          "subject": "another mail"
        },
        {
          "id": "000000004643FC50C0F14E8E855510C59A1492820100000005000000E5F5694DEFCA4D10B56BB47F169BE96300000000",
          "subject": "high PRIO!"
        },
        {
          "id": "000000004643FC50C0F14E8E855510C59A1492820100000005000000DC76E3D363FE4E7982E6B8EEDFD359A000000000",
          "subject": "low prio email"
        },
        {
          "id": "000000004643FC50C0F14E8E855510C59A1492820100000005000000058DC67BF5BD41B48F7619B8B600EC3B00000000",
          "subject": "there you go"
        },
        {
          "id": "000000004643FC50C0F14E8E855510C59A149282010000000500000098891B1DB8EA4F8C85C582A22533EBDE00000000",
          "subject": "Fattura n.000488 del 30042013"
        },
        {
          "id": "000000004643FC50C0F14E8E855510C59A1492820100000005000000905FDC170269407FAF2ABDC34DECD4B500000000",
          "subject": "Ihre Reservierung PM8042971 bei hotel.de f\u00fcr Hotel-Restaurant Hirsch (30.07.2012-03.08.2012)"
        }
      ]
    }


## List the properties of a mail message in the Inbox

    curl "http://192.168.50.11:5000/folders/000000004643FC50C0F14E8E855510C59A14928201000000030000001C90561ACCFB43B29087BD2F2ABAD1BF00000000/items/000000004643FC50C0F14E8E855510C59A1492820100000005000000C93D7B2CD9C04E30B6FB3748DAE0C17000000000" --user demo1:test
    {
      "item": {
        "received": "2014-09-26 12:41:09",
        "html": "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\"><html>\n<head>\n  <meta name=\"Generator\" content=\"Zarafa WebApp v7.1.11-46050\">\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n  <title>another mail</title>\n</head>\n<body>\n<p style=\"padding: 0; margin: 0;\"><span style=\"font-family: tahoma; font-size: 10pt;\"><span style=\"color: #888888;\">lal</span><br /></span></p>\n<p style=\"padding: 0; margin: 0;\"><span style=\"font-family: tahoma; font-size: 10pt;\"><span style=\"color: #888888;\"><br /></span></span></p>\n</body>\n</html>",
        "flags": "orange",
        "importance": "normal",
        "text": "lal\r\n\r\n\r\n\r\n",
        "size": 3792,
        "id": "000000004643FC50C0F14E8E855510C59A1492820100000005000000C93D7B2CD9C04E30B6FB3748DAE0C17000000000",
        "sent": "2014-09-26 12:41:09",
        "subject": "another mail"
      }
    }

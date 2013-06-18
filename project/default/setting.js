{
    "timer": 250000,
    "jenkins": {
    "url": "http://alpina.unige.ch",
        "jobs": [
        "Engine",
        "Utilities"
    ]
},
    "webServerAvailability": [
    {
        "name": "百度",
        "url": "http://www.baidu.com",
        "match": "百度"
    }
],
    "sonarBasic": {
    "resource":"org.apache.openejb:openejb",
    "url":"http://nemo.sonarsource.org/",
     "group":[
        {
            "name":"coverage",
            "cols":[
                {
                    "name":"line of code",
                    "key":"ncloc"
                },
                {
                    "name":"coverage",
                    "key":"coverage"
                }
            ]
        }
    ]
}
}
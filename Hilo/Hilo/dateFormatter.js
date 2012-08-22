// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿(function () {
    "use strict";

    // This module makes use of the WinRT API
    // ` Windows.Globalization.DateTimeFormatting.DateTimeFormatter`
    //
    // See the official documentation here:
    // http://msdn.microsoft.com/en-us/library/windows/apps/windows.globalization.datetimeformatting.datetimeformatter.aspx

    // Imports And Constants
    // ---------------------
    var global = Windows.Globalization,
        format = Windows.Globalization.DateTimeFormatting,
        globalizationPreferences = Windows.System.UserProfile.GlobalizationPreferences;

    // Get the current system calendar type
    var systemCalendarType = globalizationPreferences.calendars.getAt(0);

    // Construct a calendar that we can use for formatting dates
    var calendar = new global.Calendar(globalizationPreferences.languages, systemCalendarType, global.ClockIdentifiers.twelveHour);

    // Instatiate a throw-away instance of `DateTimeFormatter`
    // just so we can acquire the geographic region in order 
    // to construct a another `DateTimeFormatter` with all of 
    // the appropriate values.
    var geographicRegion = new format.DateTimeFormatter("shortdate").resolvedGeographicRegion;

    // Construct a `DateTimeFormatter` that will _only_ return the full month and full year for 
    // the current system calendar settings.
    var dtf = new format.DateTimeFormatter(
        format.YearFormat.full,
        format.MonthFormat.full,
        format.DayFormat.none,
        format.DayOfWeekFormat.none,
        format.HourFormat.none,
        format.MinuteFormat.none,
        format.SecondFormat.none,
        globalizationPreferences.languages,
        geographicRegion,
        calendar.getCalendarSystem(),
        calendar.getClock()
        );

    // Private Methods
    // ---------------

    function getMonthYearFrom(date) {
        return dtf.format(date);
    }

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.dateFormatter", {
        getMonthYearFrom: getMonthYearFrom
    });

}());
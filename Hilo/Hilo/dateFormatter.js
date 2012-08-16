(function () {
    "use strict";

    // Imports And Constants
    // ---------------------
    var global = Windows.Globalization,
        format = Windows.Globalization.DateTimeFormatting,
        globalizationPreferences = Windows.System.UserProfile.GlobalizationPreferences;


    var systemCalendarType = globalizationPreferences.calendars.getAt(0);
    var cal = new global.Calendar(globalizationPreferences.languages, systemCalendarType, global.ClockIdentifiers.twelveHour);

    var geographicRegion = new format.DateTimeFormatter("shortdate").resolvedGeographicRegion;

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
        cal.getCalendarSystem(),
        cal.getClock()
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
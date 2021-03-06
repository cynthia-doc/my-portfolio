// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.List;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

/** Find available meeting time slots */
public final class FindMeetingQuery {
  private static final Comparator<Event> SORT_EVENT_BY_START_COMPARATOR = new Comparator<Event>() {
    @Override
    public int compare(Event a, Event b) {
      return Long.compare(a.getWhen().start(), b.getWhen().start());
    }
  };

  /** Get events of requested attendees */
  private List<Event> getRelevantEvents(Collection<Event> events, Collection<String> requestedAttendee) {
    List<Event> relevantEvents = new ArrayList<>();
    for (Event currEvent : events) {
      Set<String> meetingAttendee = new HashSet<>(currEvent.getAttendees());
      meetingAttendee.retainAll(requestedAttendee);
      if (!meetingAttendee.isEmpty()) {
        relevantEvents.add(currEvent);
      }
    }
    return relevantEvents;
  }

  /** check if time from start to end is at least length of duration */
  private boolean isTimeRangeLongEnough(int start, int end, long duration) {
    if ((end - start) < duration) {
      return false;
    }
    return true;
  }

  /** Find available timeranges given requested attendees */
  public Collection<TimeRange> queryHelper(Collection<Event> events, Collection<String> attendees, long duration) {
    List<Event> relevantEvents = getRelevantEvents(events, attendees);
    relevantEvents.sort(SORT_EVENT_BY_START_COMPARATOR);

    int start = TimeRange.START_OF_DAY;
    int end = TimeRange.START_OF_DAY;
    int currStart;
    TimeRange prevTimeRange = TimeRange.fromStartDuration(0, 0);
    TimeRange currTimeRange;
    Event prevEvent = null;
    Collection<TimeRange> possibleTimes = new ArrayList<>();

    for (Event currEvent : relevantEvents) {
      currTimeRange = currEvent.getWhen();
      currStart = currTimeRange.start();
      if (prevTimeRange.contains(currTimeRange)) {
        continue;
      } else if (prevTimeRange.overlaps(currTimeRange)) {
        start = currTimeRange.end();
      } else {
        end = currStart;
      }

      if (isTimeRangeLongEnough(start, end, duration)) {
        possibleTimes.add(TimeRange.fromStartEnd(start, end, false));
      }
      start = currTimeRange.end();
      prevEvent = currEvent;
      prevTimeRange = currTimeRange;
    }
    /** Add time range from the end of last meeting to the end of the day */
    if (isTimeRangeLongEnough(start, TimeRange.END_OF_DAY, duration)) {
      possibleTimes.add(TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true));
    }

    return possibleTimes;
  }

  /** Find available timeranges given a meeting request */
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    long duration = request.getDuration();
    Collection<String> requiredAttendees = request.getAttendees();
    List<String> withOptionalAttendees = new ArrayList<>();
    withOptionalAttendees.addAll(requiredAttendees);
    withOptionalAttendees.addAll(request.getOptionalAttendees());

    Collection<TimeRange> requiredSlots = queryHelper(events, requiredAttendees, duration);
    Collection<TimeRange> withOptionalSlots = queryHelper(events, withOptionalAttendees, duration);

    if (requiredAttendees.isEmpty()) {
      return withOptionalSlots;
    } else if (withOptionalSlots.isEmpty()) {
      return requiredSlots;
    }
    return withOptionalSlots;
  }
}

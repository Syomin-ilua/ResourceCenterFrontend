import { api } from "./api";
import type { Event } from "../types";

export const eventsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createEvent: builder.mutation<{ message: string }, FormData>({
            query: (eventData) => ({
                url: "/events",
                method: "POST",
                body: eventData
            })
        }),
        deleteEvent: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/events/${id}`,
                method: "DELETE",
            })
        }),
        deleteUserInEvent: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/delete-user-event/${id}`,
                method: "DELETE",
            })
        }),
        getAllEvent: builder.query<Event[], void>({
            query: () => ({
                url: "/events",
                method: "GET",
            })
        }),
        getEventById: builder.query<Event, string>({
            query: (id) => ({
                url: `/events/${id}`,
                method: "GET",
            })
        }),
        joinEvent: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/event/${id}`,
                method: "POST",
            })
        }),
        exitEvent: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/event/${id}`,
                method: "DELETE",
            })
        }),
        updateEvent: builder.mutation<{ message: string }, { updateEventData: FormData, eventId: number }>({
            query: ({ updateEventData, eventId }) => ({
                url: `/events/${eventId}`,
                method: "PUT",
                body: updateEventData
            })
        })
    })
});

export const { endpoints: { createEvent, deleteEvent, getAllEvent, getEventById, deleteUserInEvent, joinEvent, exitEvent, updateEvent } } = eventsApi;
export const { useCreateEventMutation, useDeleteEventMutation, useGetAllEventQuery, useGetEventByIdQuery, useLazyGetAllEventQuery, useLazyGetEventByIdQuery, useDeleteUserInEventMutation, useExitEventMutation, useJoinEventMutation, useUpdateEventMutation } = eventsApi;
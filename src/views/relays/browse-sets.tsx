import { Card, CardBody, CardHeader, Flex, Text } from "@chakra-ui/react";
import { kinds } from "nostr-tools";
import { getEventUID } from "nostr-idb";

import VerticalPageLayout from "../../components/vertical-page-layout";
import PeopleListProvider, { usePeopleListContext } from "../../providers/local/people-list-provider";
import RelaySelectionProvider, { useRelaySelectionRelays } from "../../providers/local/relay-selection-provider";
import RelaySelectionButton from "../../components/relay-selection/relay-selection-button";
import PeopleListSelection from "../../components/people-list-selection/people-list-selection";
import useTimelineLoader from "../../hooks/use-timeline-loader";
import { useTimelineCurserIntersectionCallback } from "../../hooks/use-timeline-cursor-intersection-callback";
import useSubject from "../../hooks/use-subject";
import IntersectionObserverProvider from "../../providers/local/intersection-observer";
import { NostrEvent } from "../../types/nostr-event";
import { getListName, getRelaysFromList } from "../../helpers/nostr/lists";
import { RelayFavicon } from "../../components/relay-favicon";
import TimelineActionAndStatus from "../../components/timeline-page/timeline-action-and-status";

function RelaySetCard({ set }: { set: NostrEvent }) {
  const name = getListName(set);
  const relays = getRelaysFromList(set);

  return (
    <Card>
      <CardHeader p="4">{name}</CardHeader>
      <CardBody px="4" pb="4" pt="0" display="flex" flexDirection="row" gap="2" flexWrap="wrap">
        {relays.map((relay) => (
          <Text>
            <RelayFavicon relay={relay} /> {relay}
          </Text>
        ))}
      </CardBody>
    </Card>
  );
}

function BrowseRelaySetsPage() {
  const relays = useRelaySelectionRelays();
  const { filter } = usePeopleListContext();
  const timeline = useTimelineLoader("relay-sets", relays, filter && { kinds: [kinds.Relaysets], ...filter }, {
    eventFilter: (e) => getRelaysFromList(e).length > 0,
  });

  const relaySets = useSubject(timeline.timeline);
  const callback = useTimelineCurserIntersectionCallback(timeline);

  return (
    <VerticalPageLayout>
      <Flex gap="2" wrap="wrap">
        <RelaySelectionButton />
        <PeopleListSelection />
      </Flex>
      <IntersectionObserverProvider callback={callback}>
        {relaySets.map((set) => (
          <RelaySetCard key={getEventUID(set)} set={set} />
        ))}
      </IntersectionObserverProvider>
      <TimelineActionAndStatus timeline={timeline} />
    </VerticalPageLayout>
  );
}

export default function BrowseRelaySetsView() {
  return (
    <RelaySelectionProvider>
      <PeopleListProvider>
        <BrowseRelaySetsPage />
      </PeopleListProvider>
    </RelaySelectionProvider>
  );
}

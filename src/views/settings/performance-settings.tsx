import { useFormContext } from "react-hook-form";
import {
  Flex,
  FormControl,
  FormLabel,
  Switch,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  Box,
  AccordionIcon,
  FormHelperText,
  Input,
  Link,
  FormErrorMessage,
  Select,
  Button,
  Text,
} from "@chakra-ui/react";
import { useLocalStorage } from "react-use";

import { safeUrl } from "../../helpers/parse";
import { AppSettings } from "../../services/settings/migrations";
import { PerformanceIcon } from "../../components/icons";
import { selectedMethod } from "../../services/verify-event";

function VerifyEventSettings() {
  const [verifyEventMethod, setVerifyEventMethod] = useLocalStorage<string>("verify-event-method", "internal", {
    raw: true,
  });

  console.log(selectedMethod, verifyEventMethod);

  return (
    <>
      <FormControl>
        <FormLabel htmlFor="verifyEventMethod" mb="0">
          Verify event method
        </FormLabel>
        <Select value={verifyEventMethod} onChange={(e) => setVerifyEventMethod(e.target.value)} maxW="sm">
          <option value="wasm">WebAssembly</option>
          <option value="internal">Internal</option>
          <option value="none">None</option>
        </Select>
        <FormHelperText>Default: All events signatures are checked</FormHelperText>
        <FormHelperText>WebAssembly: Events signatures are checked in a separate thread</FormHelperText>
        <FormHelperText>None: Only Profiles, Follows, and replaceable event signatures are checked</FormHelperText>

        {selectedMethod !== verifyEventMethod && (
          <>
            <Text color="blue.500" mt="2">
              NOTE: You must reload the app for this setting to take effect
            </Text>
            <Button colorScheme="primary" size="sm" onClick={() => location.reload()}>
              Reload App
            </Button>
          </>
        )}
      </FormControl>
    </>
  );
}

export default function PerformanceSettings() {
  const { register, formState } = useFormContext<AppSettings>();

  return (
    <AccordionItem>
      <h2>
        <AccordionButton fontSize="xl">
          <PerformanceIcon mr="2" boxSize={5} />
          <Box as="span" flex="1" textAlign="left">
            Performance
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>
        <Flex direction="column" gap="4">
          <FormControl>
            <Flex alignItems="center">
              <FormLabel htmlFor="proxy-user-media" mb="0">
                Proxy user media
              </FormLabel>
              <Switch id="proxy-user-media" {...register("proxyUserMedia")} />
            </Flex>
            <FormHelperText>
              <span>Enabled: Use media.nostr.band to get smaller profile pictures (saves ~50Mb of data)</span>
              <br />
              <span>Side Effect: Some user pictures may not load or may be outdated</span>
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="imageProxy" mb="0">
              Image proxy service
            </FormLabel>
            <Input
              id="imageProxy"
              type="url"
              {...register("imageProxy", {
                setValueAs: (v) => safeUrl(v) || v,
              })}
            />
            {formState.errors.imageProxy && <FormErrorMessage>{formState.errors.imageProxy.message}</FormErrorMessage>}
            <FormHelperText>
              <span>
                A URL to an instance of{" "}
                <Link href="https://github.com/willnorris/imageproxy" isExternal target="_blank">
                  willnorris/imageproxy
                </Link>
              </span>
            </FormHelperText>
          </FormControl>
          <FormControl>
            <Flex alignItems="center">
              <FormLabel htmlFor="autoShowMedia" mb="0">
                Show embeds
              </FormLabel>
              <Switch id="autoShowMedia" {...register("autoShowMedia")} />
            </Flex>
            <FormHelperText>Disabled: Embeds will show an expandable button</FormHelperText>
          </FormControl>
          <FormControl>
            <Flex alignItems="center">
              <FormLabel htmlFor="showReactions" mb="0">
                Show reactions
              </FormLabel>
              <Switch id="showReactions" {...register("showReactions")} />
            </Flex>
            <FormHelperText>Enabled: Show reactions on notes</FormHelperText>
          </FormControl>
          <FormControl>
            <Flex alignItems="center">
              <FormLabel htmlFor="autoDecryptDMs" mb="0">
                Automatically decrypt DMs
              </FormLabel>
              <Switch id="autoDecryptDMs" {...register("autoDecryptDMs")} />
            </Flex>
            <FormHelperText>Enabled: automatically decrypt direct messages</FormHelperText>
          </FormControl>
          <VerifyEventSettings />
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
}

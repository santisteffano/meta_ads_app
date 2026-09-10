import type { CopyBrief } from "@/lib/prompts";

export type MetaCity = {
  key: string;
  name: string;
};

export function ageRange(_audience: CopyBrief["audience"]) {
  return { age_min: 21, age_max: 54 };
}

export function geoLocations(
  audience: CopyBrief["audience"],
  cities?: MetaCity[],
) {
  if (audience === "b2c" && cities?.length) {
    return {
      cities: cities.map((city) => ({
        key: city.key,
        radius: 20,
        distance_unit: "kilometer" as const,
      })),
    };
  }
  return { countries: ["UY"] };
}

export function placementsForFormat(format: string) {
  if (format === "9:16") {
    return {
      publisher_platforms: ["facebook", "instagram"],
      facebook_positions: ["story", "facebook_reels"],
      instagram_positions: ["story", "reels"],
      device_platforms: ["mobile"],
    };
  }
  return {
    publisher_platforms: ["facebook", "instagram"],
    facebook_positions: ["feed"],
    instagram_positions: ["stream"],
  };
}

export function targetingSpec(
  brief: CopyBrief,
  format: string,
  cities?: MetaCity[],
) {
  return {
    ...ageRange(brief.audience),
    geo_locations: geoLocations(brief.audience, cities),
    ...placementsForFormat(format),
    targeting_automation: { advantage_audience: 0 },
  };
}

export function targetingLabel(
  audience: CopyBrief["audience"],
  cities?: MetaCity[],
) {
  const ages = "21-54 años";
  if (audience === "b2c") {
    const zone = cities?.length
      ? cities.map((city) => city.name).join(" y ")
      : "Montevideo y Ciudad de la Costa";
    return `${zone} · ${ages}`;
  }
  if (audience === "b2b") return `Uruguay · comercios · ${ages}`;
  return `Uruguay · eventos · ${ages}`;
}

export function adsManagerUrl(accountId: string, campaignId?: string) {
  const act = accountId.replace(/^act_/i, "");
  const url = new URL("https://adsmanager.facebook.com/adsmanager/manage/campaigns");
  url.searchParams.set("act", act);
  if (campaignId) url.searchParams.set("selected_campaign_ids", campaignId);
  return url.toString();
}

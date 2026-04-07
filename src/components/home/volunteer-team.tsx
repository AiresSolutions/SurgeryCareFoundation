"use client";

import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { PlusIcon } from "@/components/ui/icons";
import { useApi } from "@/hooks/use-api";
import { publicService } from "@/services/public.service";
import type { BoardMember } from "@/types/content";

function TeamCard({ member }: { member: BoardMember }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-6 w-full max-w-[357px]">
        <div className="relative overflow-hidden rounded-[40px] border border-surface-subtle bg-surface-bg shadow-soft">
          <div
            className="absolute left-1/2 top-12 h-[80%] w-[80%] -translate-x-1/2 rounded-full blur-[40px]"
            style={{
              backgroundImage:
                "linear-gradient(234deg, rgba(1, 74, 98, 0.05) 0%, rgba(1, 238, 163, 0.1) 100%)",
            }}
          />

          <div className="relative mx-auto aspect-[293/442] w-[82%] pt-10 pb-6">
            {member.photoUrl ? (
              <Image
                src={member.photoUrl}
                alt={member.name}
                fill
                className="object-contain object-bottom"
                sizes="(min-width: 1024px) 293px, (min-width: 640px) 50vw, 100vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-[28px] bg-surface-page">
                <span className="text-[72px] font-black text-primary/15">
                  {member.name.slice(0, 1).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="absolute -bottom-5 left-1/2 z-10 flex size-12 -translate-x-1/2 items-center justify-center rounded-full bg-primary shadow-secondary">
          <PlusIcon className="size-6 text-white" />
        </div>
      </div>

      <Heading level="h4" as="h3" className="mb-1 mt-2">
        {member.name}
      </Heading>
      <Text as="span" size="label" className="font-bold tracking-[0.35px] text-accent">
        {member.title || "Core Team"}
      </Text>
      {member.bio && (
        <Text variant="secondary" className="mt-3 max-w-sm">
          {member.bio}
        </Text>
      )}
    </div>
  );
}

export function VolunteerTeam() {
  const { data: members, isLoading } = useApi<BoardMember[]>(
    () => publicService.getBoardMembers(),
    [],
  );

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute -right-32 -top-16 h-[800px] w-[500px] rotate-[20deg] rounded-[80px] bg-gradient-to-b from-surface-green/80 to-surface-green/20 blur-sm" />

      <Container className="relative">
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="h-px w-6 bg-accent-green" />
          <Text as="span" size="label" className="font-black tracking-[1.4px] text-accent-green">
            Our People
          </Text>
          <span className="h-px w-6 bg-accent-green" />
        </div>

        <Heading level="h2" className="mx-auto mb-16 max-w-md text-center">
          Meet Our Volunteer <span className="text-accent">Team</span> Members
        </Heading>

        {isLoading ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse rounded-[40px] bg-surface-bg"
              />
            ))}
          </div>
        ) : members && members.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-surface-border bg-white px-6 py-14 text-center shadow-card">
            <Heading level="h4" as="h3" className="mb-2">
              Team details coming soon
            </Heading>
            <Text variant="secondary">
              We&apos;re updating the latest board and volunteer information right now.
            </Text>
          </div>
        )}
      </Container>
    </section>
  );
}

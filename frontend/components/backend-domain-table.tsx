"use client";

import { Table } from "@heroui/react";

import type { BackendDomain } from "@/types";

type BackendDomainTableProps = {
  domains: BackendDomain[];
};

export function BackendDomainTable({ domains }: BackendDomainTableProps) {
  return (
    <Table
      className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-[0_14px_44px_rgba(2,6,23,0.12)]"
      variant="secondary"
    >
      <Table.ScrollContainer className="w-full">
        <Table.Content
          aria-label="Backend domains ready for frontend integration"
        >
          <Table.Header>
            <Table.Column isRowHeader>Domain</Table.Column>
            <Table.Column>Route</Table.Column>
            <Table.Column>Frontend use</Table.Column>
          </Table.Header>
          <Table.Body renderEmptyState={() => "No backend domains mapped yet."}>
            {domains.map((domain) => (
              <Table.Row id={domain.title} key={domain.title}>
                <Table.Cell>{domain.title}</Table.Cell>
                <Table.Cell>{domain.route}</Table.Cell>
                <Table.Cell>{domain.description}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
